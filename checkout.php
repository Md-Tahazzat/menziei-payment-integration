<?php 
/*
Template Name: Checkout page  
*/
get_header();

// Get the dynamic basecamp ID from the URL
$basecamp_id = $_GET['checkout_id'];
$first_day = $_GET['first_day'];
$second_day = $_GET['second_day'];
$adult_persons = $_GET['adult_persons'];

$url = home_url()."/wp-json/hostway/v1/listings/$basecamp_id";
$response  = wp_remote_get($url);

// Check if the request was successful
if (is_wp_error($response)) {
    echo "<section class='hero-wrap'><h1>Error: $response->get_error_message()</h1></section>";
} else {
    $data = wp_remote_retrieve_body($response);
   $decoded_data = json_decode($data, true);

    // result and status
    $status = $decoded_data['status'];
    if($status===200){
        // single basecamp result
    $result = $decoded_data['data']['result'];
?>




    <section data-basecamp-addons="<?php echo count($result['listingFeeSetting']) ?>" id="checkout-page" class="main-content-section ">
    <!-- Form Section -->
        <section  data-basecamp-id="<?php echo $basecamp_id ?>"  id="basecamp-id-holder"  class="form-wrap">
            <div class="common-wrap">
                <div class="checkout-info">
                <div class="form-inner">
                    <h1 class="split-heading">CONFIRM YOUR URBAN DETOX</h1>

                        <!-- Calendar alert container starts
                             =============================== -->
                             <div class="alert-container hidden">
                                <div class="alert-inner">
                                    <p class="alert-message"></p>
                                    <i onclick="hideAlertModal()" id="close-alert-container"
                                        class="fa-solid fa-xmark"></i>
                                </div>
                            </div>
                            <!-- Calendar alert container ends -->
                    
                    <!-- <form  action="#"> -->
                    <div class="reservation-details">
                                    <h3 class="split-heading">Reservation Details</h3>
                                    <div class="date fadeIn-from-bottom" data-aos="fade-up" data-aos-delay="200">
                                        <h5>Dates</h5>
                                        <button type="button" onclick="openCalendarModal()" ><img src="<?php echo get_template_directory_uri(); ?>/assets/img/Form-img/img/date-icn.svg" alt=""></button>
                                        <input class="selected-date-input" type="text" placeholder="Select Dates">
                                    </div>
                                    <div class="adult fadeIn-from-bottom" data-aos="fade-up" data-aos-delay="200">
                                        <h5>Adults</h5>
                                        <div class="adults-cunter hot-dog-counter">
                                            <span class="button" onclick="decreaseAdultCount(event, this)"><img
                                                    src="<?php echo get_template_directory_uri(); ?>/assets/svgs/minus.svg"></span>
                                            <input type="text" class="input-num mobile desktop adult-input-num" value="0" min="0">
                                            <span class="button up-btn" onclick="increaseAdultCount(event, this)"><img
                                                    src="<?php echo get_template_directory_uri(); ?>/assets/svgs/plus.svg"></span>
                                        </div>
                                        <input class="selected-adults-input" type="text" placeholder="Select Adults">
                                    </div>

                                    <!-- fetch the calculate price data starts -->
                                     <!-- fetch price details data -->
                                     <?php

                                        $post_body = json_encode( array(
                                            "listingId"=> $basecamp_id ,
                                            "startingDate" => "$first_day",
                                            "endingDate" => "$second_day",
                                        ));

                                        $args = array(
                                            'body' => $post_body, // Pass the JSON-encoded string as the body
                                            'headers' => array(
                                                'Content-Type' => 'application/json', // Set content type to JSON
                                            ),
                                        );
                                        $price_calculate_url = home_url()."/wp-json/hostway/v1/calculate-price";
                                        $price_calculation_response  = wp_remote_post($price_calculate_url, $args);

                                        // declare global variables;
                                        $price_result;
                                        $price_components;

                                        // calculate the total night
                                        $startDate = new DateTime($first_day);
                                        $endDate = new DateTime($second_day);
                                        $interval = $startDate->diff($endDate);
                                        $total_night = $interval->days;
                                        $error_message;

                                        // Check if the request was successful
                                        if (is_wp_error($price_calculation_response)) {
                                            $error_message = $price_calculation_response->get_error_message();
                                        } else {
                                            $price_data = wp_remote_retrieve_body($price_calculation_response);
                                            $decoded_price_data = json_decode($price_data, true);

                                            // result and status
                                            $price_status = $decoded_price_data['status'];
                                            if($price_status===200){
                                            $price_result = $decoded_price_data['data']['result'];
                                            $price_components = $decoded_price_data['data']['result']['components'];
                                        }else{
                                            $error_message = "Internal Server Error";
                                            }}
                                 ?>
                                    <!-- fetch the calculate price data ends -->
                                    <div class="price-details-mobi mobi fadeIn-from-bottom" data-aos="fade-up"
                                        data-aos-delay="200">
                                        <div class="coupon-btn">
                                                <input id="coupone-input" class="small-device" type="text" placeholder="Coupon code"></input>
                                                <button onclick="requestCoupon()">Apply</button>
                                        </div> 
                                        <div class="price-details-content small-devices">
                                           <?php 
                                              // show the prices
                                                if(isset($price_components)){
                                                     // price details contianer starts -->
                                                $index = 1;
                                                echo '<div class="price-details-container">';
                                                foreach($price_components as $item):
                                                    // render the extra empty price row conditionalty
                                                    if($index===2){
                                                   echo '<div class="price-row extra-price-row">';
                                                   echo '</div>';
                                                     };

                                                     if($index ===1){ ?>
                                                        <div class="price-row">
                                                        <div class="price-title ">$<span class="base-price-amount"><?php echo $result['price'] ?></span> x <span class="total-night-text"><?php echo $total_night ?> Nights</span></div><div class="price-value">$<span class="total-nights-price"><?php
                                                        // print the price conditionaly;
                                                         if(isset($price_components[0]['total'])){
                                                            echo $price_components[0]['total'];
                                                         }else{
                                                            echo $daysDifference * $result['price'];
                                                         };
                                                          ?>
                                                                </span>
                                                            </div>
                                                        </div> 
                                                    <?php }else{ ?>
                                                    <div class="price-row">
                                                        <div class="price-title"><span><?php echo $item['title'] ?></span></div><div class="price-value">$<span class="total-taxes-price"><?php echo $item['total'] ?></span></div>
                                                    </div>
                                                     <?php
                                                    };

                                                    $index++;
                                                endforeach;
                                                ?>
                                                <hr class="section-divider" />
                                                <div class="price-row">
                                                    <div class="price-title"><span>Total</span></div><div class="price-value">$<span class="total-price-el"><?php echo $price_result['totalPrice'] ?></span></div>
                                                </div>
                                                <?php
                                                  echo "</div>";
                                                  // price details contianer ends -->
                                                }else{
                                                    ?>
                                                    <div class="price-details-container">
                                                        <div class="price-row">
                                                            <div class="price-title">
                                                                <?php
                                                                echo "<pre>";
                                                                echo "Error: $error_message";
                                                                echo "</pre>";
                                                                 ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <?php
                                                }
                                            ?>

                                            <!-- price details demo card -->
                                            <!-- <div class="price-row">
                                                    <div class="price-title">$<span class="base-price-amount">739</span> x <span class="total-night-text">2 Nights</span></div><div class="price-value">$<span class="total-nights-price">178.00</span></div>
                                                </div>
                                                <div class="price-row extra-price-row">
                                                </div>
                                                <div class="price-row">
                                                    <div class="price-title"><span>Taxes</span></div><div class="price-value">$<span class="total-taxes-price">178.00</span></div>
                                                </div>

                                                <hr class="section-divider" />
                                                <div class="price-row">
                                                    <div class="price-title"><span>Total</span></div><div class="price-value">$<span class="total-price-el">178.00</span></div>
                                                </div> -->
                                            <!-- fetch price details data ends -->       
                                        </div>
                                    </div>

                    </div>

                    <!-- country dropdown array starts -->
                        <?php
                        $countries = array(
                            "AF" => array("name" => "Afghanistan", "code" => "AFG", "flag" => "", "phone_code" => "+93"), 
                            "AL" => array("name" => "Albania", "code" => "ALB", "flag" => "", "phone_code" => "+355"), 
                            "DZ" => array("name" => "Algeria", "code" => "DZA", "flag" => "", "phone_code" => "+213"), 
                            "AD" => array("name" => "Andorra", "code" => "AND", "flag" => "", "phone_code" => "+376"), 
                            "AO" => array("name" => "Angola", "code" => "AGO", "flag" => "", "phone_code" => "+244"), 
                            "AI" => array("name" => "Anguilla", "code" => "AIA", "flag" => "", "phone_code" => "+1"), 
                            "AQ" => array("name" => "Antarctica", "code" => "ATA", "flag" => "", "phone_code" => "+672"), 
                            "AG" => array("name" => "Antigua and Barbuda", "code" => "ATG", "flag" => "", "phone_code" => "+1"), 
                            "AR" => array("name" => "Argentina", "code" => "ARG", "flag" => "", "phone_code" => "+54"), 
                            "AM" => array("name" => "Armenia", "code" => "ARM", "flag" => "", "phone_code" => "+374"), 
                            "AW" => array("name" => "Aruba", "code" => "ABW", "flag" => "", "phone_code" => "+297"), 
                            "AU" => array("name" => "Australia", "code" => "AUS", "flag" => "", "phone_code" => "+61"), 
                            "AT" => array("name" => "Austria", "code" => "AUT", "flag" => "", "phone_code" => "+43"), 
                            "AZ" => array("name" => "Azerbaijan", "code" => "AZE", "flag" => "", "phone_code" => "+994"), 
                            "BS" => array("name" => "Bahamas", "code" => "BHS", "flag" => "", "phone_code" => "+1"), 
                            "BH" => array("name" => "Bahrain", "code" => "BHR", "flag" => "", "phone_code" => "+973"), 
                            "BD" => array("name" => "Bangladesh", "code" => "BGD", "flag" => "", "phone_code" => "+880"), 
                            "BB" => array("name" => "Barbados", "code" => "BRB", "flag" => "", "phone_code" => "+1"), 
                            "BY" => array("name" => "Belarus", "code" => "BLR", "flag" => "", "phone_code" => "+375"), 
                            "BE" => array("name" => "Belgium", "code" => "BEL", "flag" => "", "phone_code" => "+32"), 
                            "BZ" => array("name" => "Belize", "code" => "BLZ", "flag" => "", "phone_code" => "+501"), 
                            "BJ" => array("name" => "Benin", "code" => "BEN", "flag" => "", "phone_code" => "+229"), 
                            "BM" => array("name" => "Bermuda", "code" => "BMU", "flag" => "", "phone_code" => "+1"), 
                            "BT" => array("name" => "Bhutan", "code" => "BTN", "flag" => "", "phone_code" => "+975"), 
                            "BO" => array("name" => "Bolivia", "code" => "BOL", "flag" => "", "phone_code" => "+591"), 
                            "BA" => array("name" => "Bosnia and Herzegovina", "code" => "BIH", "flag" => "", "phone_code" => "+387"), 
                            "BW" => array("name" => "Botswana", "code" => "BWA", "flag" => "", "phone_code" => "+267"), 
                            "BR" => array("name" => "Brazil", "code" => "BRA", "flag" => "", "phone_code" => "+55"), 
                            "IO" => array("name" => "British Indian Ocean Territory", "code" => "IOT", "flag" => "", "phone_code" => "+246"), 
                            "VG" => array("name" => "British Virgin Islands", "code" => "VGB", "flag" => "", "phone_code" => "+1"), 
                            "BN" => array("name" => "Brunei", "code" => "BRN", "flag" => "", "phone_code" => "+673"), 
                            "BG" => array("name" => "Bulgaria", "code" => "BGR", "flag" => "", "phone_code" => "+359"), 
                            "BF" => array("name" => "Burkina Faso", "code" => "BFA", "flag" => "", "phone_code" => "+226"), 
                            "BI" => array("name" => "Burundi", "code" => "BDI", "flag" => "", "phone_code" => "+257"), 
                            "KH" => array("name" => "Cambodia", "code" => "KHM", "flag" => "", "phone_code" => "+855"), 
                            "CM" => array("name" => "Cameroon", "code" => "CMR", "flag" => "", "phone_code" => "+237"), 
                            "CA" => array("name" => "Canada", "code" => "CAN", "flag" => "", "phone_code" => "+1"), 
                            "CV" => array("name" => "Cape Verde", "code" => "CPV", "flag" => "", "phone_code" => "+238"), 
                            "KY" => array("name" => "Cayman Islands", "code" => "CYM", "flag" => "", "phone_code" => "+1"), 
                            "CF" => array("name" => "Central African Republic", "code" => "CAF", "flag" => "", "phone_code" => "+236"), 
                            "TD" => array("name" => "Chad", "code" => "TCD", "flag" => "", "phone_code" => "+235"), 
                            "CL" => array("name" => "Chile", "code" => "CHL", "flag" => "", "phone_code" => "+56"), 
                            "CN" => array("name" => "China", "code" => "CHN", "flag" => "", "phone_code" => "+86"), 
                            "CX" => array("name" => "Christmas Island", "code" => "CXR", "flag" => "", "phone_code" => "+61"), 
                            "CC" => array("name" => "Cocos Islands", "code" => "CCK", "flag" => "", "phone_code" => "+61"), 
                            "CO" => array("name" => "Colombia", "code" => "COL", "flag" => "", "phone_code" => "+57"), 
                            "KM" => array("name" => "Comoros", "code" => "COM", "flag" => "", "phone_code" => "+269"), 
                            "CG" => array("name" => "Congo, Democratic Republic", "code" => "COD", "flag" => "", "phone_code" => "+243"), 
                            "CD" => array("name" => "Congo, Republic of the", "code" => "COG", "flag" => "", "phone_code" => "+242"), 
                            "CK" => array("name" => "Cook Islands", "code" => "COK", "flag" => "", "phone_code" => "+682"), 
                            "CR" => array("name" => "Costa Rica", "code" => "CRI", "flag" => "", "phone_code" => "+506"), 
                            "CI" => array("name" => "Cote d'Ivoire", "code" => "CIV", "flag" => "", "phone_code" => "+225"), 
                            "HR" => array("name" => "Croatia", "code" => "HRV", "flag" => "", "phone_code" => "+385"), 
                            "CU" => array("name" => "Cuba", "code" => "CUB", "flag" => "", "phone_code" => "+53"), 
                            "CW" => array("name" => "Curacao", "code" => "CUW", "flag" => "", "phone_code" => "+599"), 
                            "CY" => array("name" => "Cyprus", "code" => "CYP", "flag" => "", "phone_code" => "+357"), 
                            "CZ" => array("name" => "Czech Republic", "code" => "CZE", "flag" => "", "phone_code" => "+420"), 
                            "DK" => array("name" => "Denmark", "code" => "DNK", "flag" => "", "phone_code" => "+45"), 
                            "DJ" => array("name" => "Djibouti", "code" => "DJI", "flag" => "", "phone_code" => "+253"), 
                            "DM" => array("name" => "Dominica", "code" => "DMA", "flag" => "", "phone_code" => "+1"), 
                            "DO" => array("name" => "Dominican Republic", "code" => "DOM", "flag" => "", "phone_code" => "+1"), 
                            "TL" => array("name" => "East Timor", "code" => "TLS", "flag" => "", "phone_code" => "+670"), 
                            "EC" => array("name" => "Ecuador", "code" => "ECU", "flag" => "", "phone_code" => "+593"), 
                            "EG" => array("name" => "Egypt", "code" => "EGY", "flag" => "", "phone_code" => "+20"), 
                            "SV" => array("name" => "El Salvador", "code" => "SLV", "flag" => "", "phone_code" => "+503"), 
                            "GQ" => array("name" => "Equatorial Guinea", "code" => "GNQ", "flag" => "", "phone_code" => "+240"), 
                            "ER" => array("name" => "Eritrea", "code" => "ERI", "flag" => "", "phone_code" => "+291"), 
                            "EE" => array("name" => "Estonia", "code" => "EST", "flag" => "", "phone_code" => "+372"), 
                            "ET" => array("name" => "Ethiopia", "code" => "ETH", "flag" => "", "phone_code" => "+251"), 
                            "FK" => array("name" => "Falkland Islands", "code" => "FLK", "flag" => "", "phone_code" => "+500"), 
                            "FO" => array("name" => "Faroe Islands", "code" => "FRO", "flag" => "", "phone_code" => "+298"), 
                            "FJ" => array("name" => "Fiji", "code" => "FJI", "flag" => "", "phone_code" => "+679"), 
                            "FI" => array("name" => "Finland", "code" => "FIN", "flag" => "", "phone_code" => "+358"), 
                            "FR" => array("name" => "France", "code" => "FRA", "flag" => "", "phone_code" => "+33"), 
                            "GF" => array("name" => "French Guiana", "code" => "GUF", "flag" => "", "phone_code" => "+594"), 
                            "PF" => array("name" => "French Polynesia", "code" => "PYF", "flag" => "", "phone_code" => "+689"), 
                            "TF" => array("name" => "French Southern Territories", "code" => "ATF", "flag" => "", "phone_code" => "+262"), 
                            "GA" => array("name" => "Gabon", "code" => "GAB", "flag" => "", "phone_code" => "+241"), 
                            "GM" => array("name" => "Gambia", "code" => "GMB", "flag" => "", "phone_code" => "+220"), 
                            "GE" => array("name" => "Georgia", "code" => "GEO", "flag" => "", "phone_code" => "+995"), 
                            "DE" => array("name" => "Germany", "code" => "DEU", "flag" => "", "phone_code" => "+49"), 
                            "GH" => array("name" => "Ghana", "code" => "GHA", "flag" => "", "phone_code" => "+233"), 
                            "GI" => array("name" => "Gibraltar", "code" => "GIB", "flag" => "", "phone_code" => "+350"), 
                            "GR" => array("name" => "Greece", "code" => "GRC", "flag" => "", "phone_code" => "+30"), 
                            "GL" => array("name" => "Greenland", "code" => "GRL", "flag" => "", "phone_code" => "+299"), 
                            "GD" => array("name" => "Grenada", "code" => "GRD", "flag" => "", "phone_code" => "+1"), 
                            "GP" => array("name" => "Guadeloupe", "code" => "GLP", "flag" => "", "phone_code" => "+590"), 
                            "GU" => array("name" => "Guam", "code" => "GUM", "flag" => "", "phone_code" => "+1"), 
                            "GT" => array("name" => "Guatemala", "code" => "GTM", "flag" => "", "phone_code" => "+502"), 
                            "GG" => array("name" => "Guernsey", "code" => "GGY", "flag" => "", "phone_code" => "+44"), 
                            "GN" => array("name" => "Guinea", "code" => "GIN", "flag" => "", "phone_code" => "+224"), 
                            "GW" => array("name" => "Guinea-Bissau", "code" => "GNB", "flag" => "", "phone_code" => "+245"), 
                            "GY" => array("name" => "Guyana", "code" => "GUY", "flag" => "", "phone_code" => "+592"), 
                            "HT" => array("name" => "Haiti", "code" => "HTI", "flag" => "", "phone_code" => "+509"), 
                            "HM" => array("name" => "Heard Island and McDonald Islands", "code" => "HMD", "flag" => "", "phone_code" => ""), 
                            "HN" => array("name" => "Honduras", "code" => "HND", "flag" => "", "phone_code" => "+504"), 
                            "HK" => array("name" => "Hong Kong", "code" => "HKG", "flag" => "", "phone_code" => "+852"), 
                            "HU" => array("name" => "Hungary", "code" => "HUN", "flag" => "", "phone_code" => "+36"), 
                            "IS" => array("name" => "Iceland", "code" => "ISL", "flag" => "", "phone_code" => "+354"), 
                            "IN" => array("name" => "India", "code" => "IND", "flag" => "", "phone_code" => "+91"), 
                            "ID" => array("name" => "Indonesia", "code" => "IDN", "flag" => "", "phone_code" => "+62"), 
                            "IR" => array("name" => "Iran", "code" => "IRN", "flag" => "", "phone_code" => "+98"), 
                            "IQ" => array("name" => "Iraq", "code" => "IRQ", "flag" => "", "phone_code" => "+964"), 
                            "IE" => array("name" => "Ireland", "code" => "IRL", "flag" => "", "phone_code" => "+353"), 
                            "IM" => array("name" => "Isle of Man", "code" => "IMN", "flag" => "", "phone_code" => "+44"), 
                            "IL" => array("name" => "Israel", "code" => "ISR", "flag" => "", "phone_code" => "+972"), 
                            "IT" => array("name" => "Italy", "code" => "ITA", "flag" => "", "phone_code" => "+39"), 
                            "JM" => array("name" => "Jamaica", "code" => "JAM", "flag" => "", "phone_code" => "+1"), 
                            "JP" => array("name" => "Japan", "code" => "JPN", "flag" => "", "phone_code" => "+81"), 
                            "JE" => array("name" => "Jersey", "code" => "JEY", "flag" => "", "phone_code" => "+44"), 
                            "JO" => array("name" => "Jordan", "code" => "JOR", "flag" => "", "phone_code" => "+962"), 
                            "KZ" => array("name" => "Kazakhstan", "code" => "KAZ", "flag" => "", "phone_code" => "+7"), 
                            "KE" => array("name" => "Kenya", "code" => "KEN", "flag" => "", "phone_code" => "+254"), 
                            "KI" => array("name" => "Kiribati", "code" => "KIR", "flag" => "", "phone_code" => "+686"), 
                            "XK" => array("name" => "Kosovo", "code" => "XKX", "flag" => "", "phone_code" => "+383"), 
                            "KW" => array("name" => "Kuwait", "code" => "KWT", "flag" => "", "phone_code" => "+965"), 
                            "KG" => array("name" => "Kyrgyzstan", "code" => "KGZ", "flag" => "", "phone_code" => "+996"), 
                            "LA" => array("name" => "Laos", "code" => "LAO", "flag" => "", "phone_code" => "+856"), 
                            "LV" => array("name" => "Latvia", "code" => "LVA", "flag" => "", "phone_code" => "+371"), 
                            "LB" => array("name" => "Lebanon", "code" => "LBN", "flag" => "", "phone_code" => "+961"), 
                            "LS" => array("name" => "Lesotho", "code" => "LSO", "flag" => "", "phone_code" => "+266"), 
                            "LR" => array("name" => "Liberia", "code" => "LBR", "flag" => "", "phone_code" => "+231"), 
                            "LY" => array("name" => "Libya", "code" => "LBY", "flag" => "", "phone_code" => "+218"), 
                            "LI" => array("name" => "Liechtenstein", "code" => "LIE", "flag" => "", "phone_code" => "+423"), 
                            "LT" => array("name" => "Lithuania", "code" => "LTU", "flag" => "", "phone_code" => "+370"), 
                            "LU" => array("name" => "Luxembourg", "code" => "LUX", "flag" => "", "phone_code" => "+352"), 
                            "MO" => array("name" => "Macau", "code" => "MAC", "flag" => "", "phone_code" => "+853"), 
                            "MK" => array("name" => "Macedonia", "code" => "MKD", "flag" => "", "phone_code" => "+389"), 
                            "MG" => array("name" => "Madagascar", "code" => "MDG", "flag" => "", "phone_code" => "+261"), 
                            "MW" => array("name" => "Malawi", "code" => "MWI", "flag" => "", "phone_code" => "+265"), 
                            "MY" => array("name" => "Malaysia", "code" => "MYS", "flag" => "", "phone_code" => "+60"), 
                            "MV" => array("name" => "Maldives", "code" => "MDV", "flag" => "", "phone_code" => "+960"), 
                            "ML" => array("name" => "Mali", "code" => "MLI", "flag" => "", "phone_code" => "+223"), 
                            "MT" => array("name" => "Malta", "code" => "MLT", "flag" => "", "phone_code" => "+356"), 
                            "MH" => array("name" => "Marshall Islands", "code" => "MHL", "flag" => "", "phone_code" => "+692"), 
                            "MQ" => array("name" => "Martinique", "code" => "MTQ", "flag" => "", "phone_code" => "+596"), 
                            "MR" => array("name" => "Mauritania", "code" => "MRT", "flag" => "", "phone_code" => "+222"), 
                            "MU" => array("name" => "Mauritius", "code" => "MUS", "flag" => "", "phone_code" => "+230"), 
                            "YT" => array("name" => "Mayotte", "code" => "MYT", "flag" => "", "phone_code" => "+262"), 
                            "MX" => array("name" => "Mexico", "code" => "MEX", "flag" => "", "phone_code" => "+52"), 
                            "FM" => array("name" => "Micronesia", "code" => "FSM", "flag" => "", "phone_code" => "+691"), 
                            "MD" => array("name" => "Moldova", "code" => "MDA", "flag" => "", "phone_code" => "+373"), 
                            "MC" => array("name" => "Monaco", "code" => "MCO", "flag" => "", "phone_code" => "+377"), 
                            "MN" => array("name" => "Mongolia", "code" => "MNG", "flag" => "", "phone_code" => "+976"), 
                            "ME" => array("name" => "Montenegro", "code" => "MNE", "flag" => "", "phone_code" => "+382"), 
                            "MS" => array("name" => "Montserrat", "code" => "MSR", "flag" => "", "phone_code" => "+1"), 
                            "MA" => array("name" => "Morocco", "code" => "MAR", "flag" => "", "phone_code" => "+212"), 
                            "MZ" => array("name" => "Mozambique", "code" => "MOZ", "flag" => "", "phone_code" => "+258"), 
                            "MM" => array("name" => "Myanmar", "code" => "MMR", "flag" => "", "phone_code" => "+95"), 
                            "NA" => array("name" => "Namibia", "code" => "NAM", "flag" => "", "phone_code" => "+264"), 
                            "NR" => array("name" => "Nauru", "code" => "NRU", "flag" => "", "phone_code" => "+674"), 
                            "NP" => array("name" => "Nepal", "code" => "NPL", "flag" => "", "phone_code" => "+977"), 
                            "NL" => array("name" => "Netherlands", "code" => "NLD", "flag" => "", "phone_code" => "+31"), 
                            "AN" => array("name" => "Netherlands Antilles", "code" => "ANT", "flag" => "", "phone_code" => "+599"), 
                            "NC" => array("name" => "New Caledonia", "code" => "NCL", "flag" => "", "phone_code" => "+687"), 
                            "NZ" => array("name" => "New Zealand", "code" => "NZL", "flag" => "", "phone_code" => "+64"), 
                            "NI" => array("name" => "Nicaragua", "code" => "NIC", "flag" => "", "phone_code" => "+505"), 
                            "NE" => array("name" => "Niger", "code" => "NER", "flag" => "", "phone_code" => "+227"), 
                            "NG" => array("name" => "Nigeria", "code" => "NGA", "flag" => "", "phone_code" => "+234"), 
                            "NU" => array("name" => "Niue", "code" => "NIU", "flag" => "", "phone_code" => "+683"), 
                            "NF" => array("name" => "Norfolk Island", "code" => "NFK", "flag" => "", "phone_code" => "+672"), 
                            "KP" => array("name" => "North Korea", "code" => "PRK", "flag" => "", "phone_code" => "+850"), 
                            "MP" => array("name" => "Northern Mariana Islands", "code" => "MNP", "flag" => "", "phone_code" => "+1"), 
                            "NO" => array("name" => "Norway", "code" => "NOR", "flag" => "", "phone_code" => "+47"), 
                            "OM" => array("name" => "Oman", "code" => "OMN", "flag" => "", "phone_code" => "+968"), 
                            "PK" => array("name" => "Pakistan", "code" => "PAK", "flag" => "", "phone_code" => "+92"), 
                            "PW" => array("name" => "Palau", "code" => "PLW", "flag" => "", "phone_code" => "+680"), 
                            "PS" => array("name" => "Palestine", "code" => "PSE", "flag" => "", "phone_code" => "+970"), 
                            "PA" => array("name" => "Panama", "code" => "PAN", "flag" => "", "phone_code" => "+507"), 
                            "PG" => array("name" => "Papua New Guinea", "code" => "PNG", "flag" => "", "phone_code" => "+675"), 
                            "PY" => array("name" => "Paraguay", "code" => "PRY", "flag" => "", "phone_code" => "+595"), 
                            "PE" => array("name" => "Peru", "code" => "PER", "flag" => "", "phone_code" => "+51"), 
                            "PH" => array("name" => "Philippines", "code" => "PHL", "flag" => "", "phone_code" => "+63"), 
                            "PN" => array("name" => "Pitcairn", "code" => "PCN", "flag" => "", "phone_code" => "+64"), 
                            "PL" => array("name" => "Poland", "code" => "POL", "flag" => "", "phone_code" => "+48"), 
                            "PT" => array("name" => "Portugal", "code" => "PRT", "flag" => "", "phone_code" => "+351"), 
                            "PR" => array("name" => "Puerto Rico", "code" => "PRI", "flag" => "", "phone_code" => "+1"), 
                            "QA" => array("name" => "Qatar", "code" => "QAT", "flag" => "", "phone_code" => "+974"), 
                            "RE" => array("name" => "Reunion", "code" => "REU", "flag" => "", "phone_code" => "+262"), 
                            "RO" => array("name" => "Romania", "code" => "ROU", "flag" => "", "phone_code" => "+40"), 
                            "RU" => array("name" => "Russia", "code" => "RUS", "flag" => "", "phone_code" => "+7"), 
                            "RW" => array("name" => "Rwanda", "code" => "RWA", "flag" => "", "phone_code" => "+250"), 
                            "BL" => array("name" => "Saint Barthelemy", "code" => "BLM", "flag" => "", "phone_code" => "+590"), 
                            "SH" => array("name" => "Saint Helena", "code" => "SHN", "flag" => "", "phone_code" => "+290"), 
                            "KN" => array("name" => "Saint Kitts and Nevis", "code" => "KNA", "flag" => "", "phone_code" => "+1"), 
                            "LC" => array("name" => "Saint Lucia", "code" => "LCA", "flag" => "", "phone_code" => "+1"), 
                            "MF" => array("name" => "Saint Martin", "code" => "MAF", "flag" => "", "phone_code" => "+590"), 
                            "PM" => array("name" => "Saint Pierre and Miquelon", "code" => "SPM", "flag" => "", "phone_code" => "+508"), 
                            "VC" => array("name" => "Saint Vincent and the Grenadines", "code" => "VCT", "flag" => "", "phone_code" => "+1"), 
                            "WS" => array("name" => "Samoa", "code" => "WSM", "flag" => "", "phone_code" => "+685"), 
                            "SM" => array("name" => "San Marino", "code" => "SMR", "flag" => "", "phone_code" => "+378"), 
                            "ST" => array("name" => "Sao Tome and Principe", "code" => "STP", "flag" => "", "phone_code" => "+239"), 
                            "SA" => array("name" => "Saudi Arabia", "code" => "SAU", "flag" => "", "phone_code" => "+966"), 
                            "SN" => array("name" => "Senegal", "code" => "SEN", "flag" => "", "phone_code" => "+221"), 
                            "RS" => array("name" => "Serbia", "code" => "SRB", "flag" => "", "phone_code" => "+381"), 
                            "SC" => array("name" => "Seychelles", "code" => "SYC", "flag" => "", "phone_code" => "+248"), 
                            "SL" => array("name" => "Sierra Leone", "code" => "SLE", "flag" => "", "phone_code" => "+232"), 
                            "SG" => array("name" => "Singapore", "code" => "SGP", "flag" => "", "phone_code" => "+65"), 
                            "SX" => array("name" => "Sint Maarten", "code" => "SXM", "flag" => "", "phone_code" => "+1"), 
                            "SK" => array("name" => "Slovakia", "code" => "SVK", "flag" => "", "phone_code" => "+421"), 
                            "SI" => array("name" => "Slovenia", "code" => "SVN", "flag" => "", "phone_code" => "+386"), 
                            "SB" => array("name" => "Solomon Islands", "code" => "SLB", "flag" => "", "phone_code" => "+677"), 
                            "SO" => array("name" => "Somalia", "code" => "SOM", "flag" => "", "phone_code" => "+252"), 
                            "ZA" => array("name" => "South Africa", "code" => "ZAF", "flag" => "", "phone_code" => "+27"), 
                            "GS" => array("name" => "South Georgia and the South Sandwich Islands", "code" => "SGS", "flag" => "", "phone_code" => ""), 
                            "KR" => array("name" => "South Korea", "code" => "KOR", "flag" => "", "phone_code" => "+82"), 
                            "SS" => array("name" => "South Sudan", "code" => "SSD", "flag" => "", "phone_code" => "+211"), 
                            "ES" => array("name" => "Spain", "code" => "ESP", "flag" => "", "phone_code" => "+34"), 
                            "LK" => array("name" => "Sri Lanka", "code" => "LKA", "flag" => "", "phone_code" => "+94"), 
                            "SD" => array("name" => "Sudan", "code" => "SDN", "flag" => "", "phone_code" => "+249"), 
                            "SR" => array("name" => "Suriname", "code" => "SUR", "flag" => "", "phone_code" => "+597"), 
                            "SJ" => array("name" => "Svalbard and Jan Mayen", "code" => "SJM", "flag" => "", "phone_code" => ""), 
                            "SZ" => array("name" => "Swaziland", "code" => "SWZ", "flag" => "", "phone_code" => "+268"), 
                            "SE" => array("name" => "Sweden", "code" => "SWE", "flag" => "", "phone_code" => "+46"), 
                            "CH" => array("name" => "Switzerland", "code" => "CHE", "flag" => "", "phone_code" => "+41"), 
                            "SY" => array("name" => "Syria", "code" => "SYR", "flag" => "", "phone_code" => "+963"), 
                            "TW" => array("name" => "Taiwan", "code" => "TWN", "flag" => "", "phone_code" => "+886"), 
                            "TJ" => array("name" => "Tajikistan", "code" => "TJK", "flag" => "", "phone_code" => "+992"), 
                            "TZ" => array("name" => "Tanzania", "code" => "TZA", "flag" => "", "phone_code" => "+255"), 
                            "TH" => array("name" => "Thailand", "code" => "THA", "flag" => "", "phone_code" => "+66"), 
                            "TG" => array("name" => "Togo", "code" => "TGO", "flag" => "", "phone_code" => "+228"), 
                            "TK" => array("name" => "Tokelau", "code" => "TKL", "flag" => "", "phone_code" => "+690"), 
                            "TO" => array("name" => "Tonga", "code" => "TON", "flag" => "", "phone_code" => "+676"), 
                            "TT" => array("name" => "Trinidad and Tobago", "code" => "TTO", "flag" => "", "phone_code" => "+1"), 
                            "TN" => array("name" => "Tunisia", "code" => "TUN", "flag" => "", "phone_code" => "+216"), 
                            "TR" => array("name" => "Turkey", "code" => "TUR", "flag" => "", "phone_code" => "+90"), 
                            "TM" => array("name" => "Turkmenistan", "code" => "TKM", "flag" => "", "phone_code" => "+993"), 
                            "TC" => array("name" => "Turks and Caicos Islands", "code" => "TCA", "flag" => "", "phone_code" => "+1"), 
                            "TV" => array("name" => "Tuvalu", "code" => "TUV", "flag" => "", "phone_code" => "+688"), 
                            "UG" => array("name" => "Uganda", "code" => "UGA", "flag" => "", "phone_code" => "+256"), 
                            "UA" => array("name" => "Ukraine", "code" => "UKR", "flag" => "", "phone_code" => "+380"), 
                            "AE" => array("name" => "United Arab Emirates", "code" => "ARE", "flag" => "", "phone_code" => "+971"), 
                            "GB" => array("name" => "United Kingdom", "code" => "GBR", "flag" => "", "phone_code" => "+44"), 
                            "US" => array("name" => "United States", "code" => "USA", "flag" => "", "phone_code" => "+1"), 
                            "UY" => array("name" => "Uruguay", "code" => "URY", "flag" => "", "phone_code" => "+598"), 
                            "UZ" => array("name" => "Uzbekistan", "code" => "UZB", "flag" => "", "phone_code" => "+998"), 
                            "VU" => array("name" => "Vanuatu", "code" => "VUT", "flag" => "", "phone_code" => "+678"), 
                            "VA" => array("name" => "Vatican City", "code" => "VAT", "flag" => "", "phone_code" => "+379"), 
                            "VE" => array("name" => "Venezuela", "code" => "VEN", "flag" => "", "phone_code" => "+58"), 
                            "VN" => array("name" => "Vietnam", "code" => "VNM", "flag" => "", "phone_code" => "+84"), 
                            "VG" => array("name" => "Virgin Islands, British", "code" => "VGB", "flag" => "", "phone_code" => "+1"), 
                            "VI" => array("name" => "Virgin Islands, U.S.", "code" => "VIR", "flag" => "", "phone_code" => "+1"), 
                            "WF" => array("name" => "Wallis and Futuna", "code" => "WLF", "flag" => "", "phone_code" => "+681"), 
                            "EH" => array("name" => "Western Sahara", "code" => "ESH", "flag" => "", "phone_code" => "+212"), 
                            "YE" => array("name" => "Yemen", "code" => "YEM", "flag" => "", "phone_code" => "+967"), 
                            "ZM" => array("name" => "Zambia", "code" => "ZMB", "flag" => "", "phone_code" => "+260"), 
                            "ZW" => array("name" => "Zimbabwe", "code" => "ZWE", "flag" => "", "phone_code" => "+263")
                        );
                        ?>
                    <!-- country dropdown array ends -->
                    <div class="guest-details guest-details-container fadeIn-from-bottom " data-aos="fade-up" data-aos-delay="200">
                            <h3>Guest Details</h3>
                            <div class="guest-details-items fadeIn-from-bottom" data-aos="fade-up" data-aos-delay="200">
                                <div class="first-name">
                                    <h5>First Name</h5>
                                    <input data-name="firstName" class="checkout-form-input" type="text" placeholder="First Name">
                                </div>
                                <div class="first-name last-name">
                                    <h5>Last Name</h5>
                                    <input data-name="lastName" class="checkout-form-input" type="text" placeholder="Last Name">
                                </div>
                                <div class="first-name">
                                    <h5>Email </h5>
                                    <input data-name="email" class="checkout-form-input" type="text" placeholder="Your Email">
                                </div>
                                <div class="first-name phn">
                                    <h5>Phone </h5>
                                    <div class="phone-country-code-select-container">
                                                                            <!-- <input type="text" name="" id="phoneNumberInput" > -->
                                                                            <span class="phone-country-code-display-el">AF +93</span>                                                                            
                                   <select id="phone-country-code-selctor" onchange="updateCountryTelCode(event)">
                                    <?php 
                                    foreach($countries as $key => $country):?>
                                    <option class="country-phone-option <?php echo $country['phone_code']?>" data-short-name="<?php echo $key; ?>" value="<?php echo $country["phone_code"]; ?>"  >
                                        <?php echo $country['name']." ". $country['phone_code']; ?>
                                    </option>
                                      <?php endforeach;?>
                                   </select> <input data-name="telephone" class="checkout-form-input phone-input" type="tel" id="phoneInput" placeholder="Phone number" />
                                    </div>
                                </div>
                     
                            </div>
                    </div>
                    <div class="payment-information fadeIn-from-bottom" data-aos="fade-up" data-aos-delay="200">
                            <h3>Payment Information</h3>
                            <div class="payment-information-items">
                                <div id="payment-element" class="card-details">
                                    <!-- <h5>Card Details</h5>
                                    <input data-name="ccNumber" class="checkout-form-input" type="text" placeholder="1234 2541 3254 8542">
                                    <input data-name="fullName" class="checkout-form-input" type="text" placeholder="Full Name">
                                    <input maxlength="5" data-name="cardDate" class="checkout-form-input-date"  type="text" placeholder="MM/YY">
                                    <input data-name="cvc" class="checkout-form-input" type="text" placeholder="CVC">
                                      -->
                                </div>
                                <div class="card-details">
                                    <h5>Billing Address</h5>
                                    <input data-name="address" class="checkout-form-input" type="text" placeholder="Billing Address">
                                    <input data-name="city" class="checkout-form-input" type="text" placeholder="City">
                                    <input data-name="zipCode" class="checkout-form-input" type="text" placeholder="Zip Code">
                                     <select id="country-selector" onchange="updateSelectedCountry(event)">
                                    <?php 
                                    foreach($countries as $key => $country):?>
                                    <option class="country-option <?php echo $country['phone_code']?>" data-short-name="<?php echo $key; ?>" value="<?php echo $country["name"]; ?>"  >
                                        <?php echo $country['name'] ?>
                                    </option>
                                      <?php endforeach;?>
                                   </select>
                                </div>
                            </div>
                    </div>
                <!-- </form> -->
                    <!-- <div class="cancellation-policy fadeIn-from-bottom" data-aos="fade-up" data-aos-delay="200">
                        <h3>Cancellation Policy</h3>
                        <div class="cancellation-policy-list">
                            <ul>
                                <li>100% refund up to 60 days before arrival</li>
                                <li>50% refund up to 30 days before arrival</li>
                            </ul>
                        </div>
                    </div> -->
                    <div class="basecamp-rules fadeIn-from-bottom" data-aos="fade-up" data-aos-delay="200">
                        <h3>Basecamp Rules</h3>
                        <div class="cancellation-policy-list">
                            <ul>
                                <li>Respect for Nature</li>
                                <li>Safety First</li>
                                <li>Leave No Trace</li>
                                <li>Quiet Hours</li>
                                <li>Campfire Safety</li>
                                <li>Trash Disposal</li>
                                <li>Campsite Etiquette</li>
                                <li>Water Conservation</li>
                                <li>Cultural Sensitivity</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="special-requests fadeIn-from-bottom" data-aos="fade-up" data-aos-delay="200">
                        <h3>Special Requests</h3>
                        <div class="special-requests-message">
                            <p>Let us know if you have any additional requests or comments</p>
                            <textarea data-name="message" class="checkout-form-input" name="message" id="" cols="30" rows="10" placeholder="Your message"></textarea>
                            <div class="special-requests-btn">
                            <div class="info-card privacy-policy" data-aos="fade-up" data-aos-delay="200">
                                        <input class="privacy-policy-checkbox" type="checkbox" id="influental-6" name="influental">
                                        <label for="influental-6"></label>
                                        <p>I agree to the <span>privacy policy</span> and <span>terms of services.</span></p>
                                    </div>
                                <div class="reserve-btn desk">
                                    <!-- <a href="<?php home_url().'/addons' ?>" onclick="return requestReservation()" class="btn navlink-for-addons-page">reserve now </a> -->
                                    <!-- TODO: have to change this -->
                                    <button type="button"  onclick="requestReservation()" class="btn navlink-for-addons-page">reserve now </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="price-details-wrap desk">
                    <div class="right-sticky">
                    <div class="price-details-inner">
                        <div class="price-details-headding">
                            <h3><?php echo $result['name'] ?></h3>
                            <ul>
                                <li><?php echo sprintf("%02d",$result['bedsNumber']) ?> Tent</li>
                                <li><?php echo sprintf("%02d", $result['bathroomsNumber']) ?> Bathhouse</li>
                                <li><?php echo sprintf("%02d", $result['guestsIncluded']) ?> Guests</li>
                            </ul>
                        </div>
                        <div class="price-details-thumb">
                            <figure>
                                <?php
                                $imgUrl= $result['thumbnailUrl'] ? $result['thumbnailUrl']:$result['listingImages']['0']['url'];
                                 ?>
                                <img src=" <?php echo $imgUrl;?>" alt="basecamp img">
                            </figure>
                        </div>
                        <div class="price-details">
                            <h3>Price Details</h3>
                            <div data-base-price="<?php echo $result['price'] ?>" class="price-details-content large-devices">
                            <?php 
                                              // show the prices
                                                if(isset($price_components)){
                                                     // price details contianer starts -->
                                                $index = 1;
                                                echo '<div class="price-details-container">';
                                                foreach($price_components as $item):
                                                    // render the extra empty price row conditionalty
                                                    if($index===2){
                                                   echo '<div class="price-row extra-price-row">';
                                                   echo '</div>';
                                                     };

                                                     if($index ===1){ ?>
                                                        <div class="price-row">
                                                        <div class="price-title ">$<span class="base-price-amount"><?php echo $result['price'] ?></span> x <span class="total-night-text"><?php echo $total_night ?> Nights</span></div><div class="price-value">$<span class="total-nights-price"><?php
                                                        // print the price conditionaly;
                                                         if(isset($price_components[0]['total'])){
                                                            echo $price_components[0]['total'];
                                                         }else{
                                                            echo $daysDifference * $result['price'];
                                                         };
                                                          ?>
                                                                </span>
                                                            </div>
                                                        </div> 
                                                    <?php }else{ ?>
                                                    <div class="price-row">
                                                        <div class="price-title"><span><?php echo $item['title'] ?></span></div><div class="price-value">$<span class="total-taxes-price"><?php echo $item['total'] ?></span></div>
                                                    </div>
                                                     <?php
                                                    };

                                                    $index++;
                                                endforeach;
                                                ?>
                                                <hr class="section-divider" />
                                                <div class="price-row">
                                                    <div class="price-title"><span>Total</span></div><div class="price-value">$<span class="total-price-el"><?php echo $price_result['totalPrice'] ?></span></div>
                                                </div>
                                                <?php
                                                  echo "</div>";
                                                  // price details contianer ends -->
                                                }else{
                                                    ?>
                                                    <div class="price-details-container">
                                                        <div class="price-row">
                                                            <div class="price-title">
                                                                <?php
                                                                echo "<pre>";
                                                                echo "Error: $error_message";
                                                                echo "</pre>";
                                                                 ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <?php
                                                }
                                            ?>
                                
                            </div>
                            <div class="coupon-btn">
                                    <input id="coupone-input" class="large-device" type="text" placeholder="Voucher code"></input>
                                    <button class="" onclick="requestCoupon()">Apply</button>
                                </div>
                        </div>

                 
                    </div>
                    <div class="payment-secure">
                        <img src="<?php echo get_template_directory_uri(); ?>/assets/img/payment-secure-text.png" alt="payment-secure">
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </section>

          <!-- calendar modal starts -->
          <div class="calendar-container single checkout-popup-calendar disable">
            <div class="calendar single-page-date-calendar checkout-popup-calendar-inner">
                <div class="calendar-inner">
                    <div class="booking-calendar-container">
                        <div class="booking-calendar-row">
                            <div class="booking-calendar-heading month" id="current-month-heading">
                            </div>
                            <div class="calendar-btns">
                                <button onclick="singlePagePrevMonth()" class="booking-prev-month-button">
                                    &#10094;
                                </button>
                                <button onclick="singlePageNextMonth()" class="booking-next-month-button">
                                    &#10095;
                                </button>
                            </div>
                        </div>
                        <div class="booking-calendar-row">
                            <div class="booking-calendar current-month" id="current-month"></div>
                        </div>

                        <div class="booking-calendar-row">
                            <button type="button" onclick="clearCalendarDates()" class="btn">
                                Clear dates
                            </button>
                            <button type="button" onclick="closeCheckoutCalendarModalAndUpdate()" class="btn">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- calendar modal ends -->

        <!-- mobile calendar modal starts -->
        <div id="single-basecamp-mobile-calendar" class="single-basecamp-calendar hidden">
        <div class="calendar-container-mobi mobi">
            <div class="inner">
            <div class="close-modal mobi">
                <img src="<?php echo get_theme_file_uri() ?>/assets/svgs/close.svg">
            </div>

            <div class="mobile-calendar-dates-body">
                <!-- day name sticky label starts -->
                <div class="mobi-calender-day-name flex">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <!-- day name sticky label ends -->
                <!-- calendar months container starts  -->
                <div class="booking-calendar mobi-month-calendar-container">
                </div>
                <!-- calendar months container ends  -->

                <!-- Reve and clear buttons starts -->
                <div class="booking-calendar-row">
                    <button onclick="clearCalendarDates()" class="btn">
                        Clear dates
                    </button>
                    <!-- <a onclick="return checkProductPageSelectedDates()"
                        href="<?php echo home_url().'/checkout?checkout_id='. $result['id'].'&price='.$result['price'] ?>"
                        class="btn navlink-for-checkout-page">
                        Reserve now
                    </a> -->
                    <button type="button" onclick="closeCheckoutCalendarModalAndUpdate()" class="btn">
                                Update
                    </button>
                </div>
                <!-- reserve and clear buttons ends -->
            </div>
        </div>
    </div>
</div>
        <!-- mobile calendar modal ends -->

        <section class="price-btn mobi">
            <div class="common-wrap clear">
                <div class="price-inner">
                    <div class="price-count">
                    <span>$<span class="due-today-price-val"><?php echo $price_result['totalPrice'] ?></span></sp>
                    </div>
                    <div class="btn-puchase">
                    <button type="button"  onclick="requestReservation()" class="btn bg-btn navlink-for-addons-page">Purchase now</button>
                    </div>
                </div>
            </div>
    </section> 
    </section>

    <section class="get-in-touch">
            <div class="common-wrap  clear">
                <div class="get-in-inner ">
                    <h2 data-aos="fade-up" data-aos-delay="200" >DISCONNECT to <span>CONNECT.</span></h2>
                    <div class="contact-btn" data-aos="fade-up" data-aos-delay="400"> 
                    <a href="mailto:stewards@menizei.com" class="btn">Contact us</a>
                    </div>
                </div>
            </div>
        </section> 
    

<?php
}}
get_footer();
?>
