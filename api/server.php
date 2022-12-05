<?php
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");

require_once('./connection.php');
$method = $_SERVER['REQUEST_METHOD'];
define("CREATION_KEY", "contact ur admin");

// Login user in
function login($username, $password, $con){
    $sql = "SELECT username, privilege FROM `users_temp` WHERE `username` = ? AND hashed_password = MD5(?) LIMIT 1";
    $stmt = $con->prepare($sql);
    $stmt->bind_param('ss', $username, $password);
    $stmt->execute();
    $stmt = $stmt->get_result();
    $result = $stmt->fetch_all(MYSQLI_ASSOC);
    if (count($result) === 1) {
        echo json_encode($result);
    } else {
        $resp = array("data" => "User unauthorized", "status" => 401);
        http_response_code(401);
        echo json_encode($resp);
    }
}

function check_user($username, $privilege, $con){
    $sql = "SELECT username FROM `users_temp` WHERE `username` = ? LIMIT 1";
    $stmt = $con->prepare($sql);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt = $stmt->get_result();
    $result = $stmt->fetch_all(MYSQLI_ASSOC);
    if (count($result) === 1) {
        return true;
    } else {
        return false;
    }
}

function create_user($username, $password, $privilege, $key, $con){
    $auth = check_user($username, $privilege,$con);
    if($auth){
        $resp = array("data" => "User already exist", "status" => 400);
        http_response_code(400);
        echo json_encode($resp);
    }else if($key==CREATION_KEY){
        $sql = "INSERT INTO `users_temp` (`username`, `hashed_password`, `privilege`) VALUES (?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param('sss', $username, md5($password), $privilege);
        if (!$stmt->execute()) {
            $resp = array("data" => $stmt->error, "status" => 409);
            http_response_code(409);
            echo json_encode($resp);
        } else {
            $resp = array("data" => "User account successfully created", "status" => 200);
            http_response_code(200);
            echo json_encode($resp);
        }
    }else{
        $resp = array("data" => "UNAUTHORIZED! ACTION NOT ALLOWED", "status" => 401);
        http_response_code(401);
        echo json_encode($resp);
    }
}

function fetch_category($username,$privilege, $output, $con){
    $auth = check_user($username, $privilege,$con);
    if($auth){
        $start_date = $output['startDate'];
        $end_date = $output['endDate'];
        $category_id = $output['categoryID'];
        $final_output = array();
        if(!(empty($start_date) || empty($end_date) || empty($category_id))){
            $sql = "SELECT a.name as 'participant_name', b.category_name as category, count(distinct(a.msg_id)) AS 'votes' FROM vote a
                    INNER JOIN category b 
                    WHERE date(a.date) >= ? AND date(a.date) <= DATE_ADD(?, INTERVAL 1 DAY) AND a.category_id = ? 
                    AND a.msg_source = 'mobile_money' AND a.category_id = b.category_id 
                    GROUP BY a.name,a.category_id ORDER BY b.category_name";
            $stmt = $con->prepare($sql);
            $stmt->bind_param('sss', $start_date, $end_date, $category_id);
            $stmt->execute();
            $stmt = $stmt->get_result();
            $result = $stmt->fetch_all(MYSQLI_ASSOC);
            array_push($final_output, $result);

            // 
            $sql = "SELECT count(distinct(a.msg_id)) AS 'votes' FROM vote a
                    INNER JOIN category b 
                    WHERE date(a.date) >= ? AND date(a.date) <= DATE_ADD(?, INTERVAL 1 DAY) AND a.category_id = ? 
                    AND a.msg_source = 'mobile_money' AND a.category_id = b.category_id";
            $stmt1 = $con->prepare($sql);
            $stmt1->bind_param('sss', $start_date, $end_date, $category_id);
            $stmt1->execute();
            $stmt1 = $stmt1->get_result();
            $result1 = $stmt1->fetch_all(MYSQLI_ASSOC);
            array_push($final_output, $result1);

            echo json_encode($final_output);
        }else{
            $resp = array("data" => "Bad Request. One or more fields empty", "status" => 400);
            http_response_code(400);
            echo json_encode($resp);
        }
       
    }else{
        $resp = array("data" => "User unauthorized", "status" => 401);
        http_response_code(401);
        echo json_encode($resp);
    }
}

function fetch_competition($username,$privilege, $output, $con){
    $auth = check_user($username, $privilege,$con);
    if($auth){
        $start_date = $output['startDate'];
        $end_date = $output['endDate'];
        $competition_id = $output['competitionID'];
        $final_output = array();
        if(!(empty($start_date) || empty($end_date) || empty($competition_id))){
            $sql = "SELECT category_id, category_name FROM voting.category WHERE contest_id=?";
            $stmt = $con->prepare($sql);
            $stmt->bind_param('s', $competition_id);
            $stmt->execute();
            $stmt = $stmt->get_result();
            $result = $stmt->fetch_all(MYSQLI_ASSOC);
            
            array_push($final_output, $result);

            // 
            $sql = "SELECT a.contest_id as competition_id, a.name as 'participant_name', b.category_name as category, count(distinct(a.msg_id)) AS 'votes' FROM vote a
                    INNER JOIN category b 
                    WHERE a.date >= ? AND a.date <= DATE_ADD(?, INTERVAL 1 DAY) AND a.contest_id = ?
                    AND a.msg_source = 'mobile_money' AND a.category_id = b.category_id 
                    GROUP BY a.name,a.category_id ORDER BY b.category_name";
            $stmt1 = $con->prepare($sql);
            $stmt1->bind_param('sss', $start_date, $end_date, $competition_id);
            $stmt1->execute();
            $stmt1 = $stmt1->get_result();
            $result1 = $stmt1->fetch_all(MYSQLI_ASSOC);
            array_push($final_output, $result1);

            // 
            $sql = "SELECT count(distinct(a.msg_id)) AS 'votes' FROM vote a
                    INNER JOIN category b 
                    WHERE a.date >= ? AND a.date <= DATE_ADD(?, INTERVAL 1 DAY) AND a.contest_id = ?
                    AND a.msg_source = 'mobile_money' AND a.category_id = b.category_id";

            $stmt2 = $con->prepare($sql);
            $stmt2->bind_param('sss', $start_date, $end_date, $competition_id);
            $stmt2->execute();
            $stmt2 = $stmt2->get_result();
            $result2 = $stmt2->fetch_all(MYSQLI_ASSOC);
            array_push($final_output, $result2);
            // 
            echo json_encode($final_output);
        }else{
            $resp = array("data" => "Bad Request. One or more fields empty", "status" => 400);
            http_response_code(400);
            echo json_encode($resp);
        }
       
    }else{
        $resp = array("data" => "User unauthorized", "status" => 401);
        http_response_code(401);
        echo json_encode($resp);
    }
}


function fetch_competition_with_category($username,$privilege, $output, $con){
    $auth = check_user($username, $privilege,$con);
    if($auth){
        $start_date = $output['startDate'];
        $end_date = $output['endDate'];
        $competition_id = $output['competitionID'];
        $category_id = $output['selectedCategory'];
        $final_output = array();
        if(!(empty($start_date) || empty($end_date) || empty($competition_id))){
            $sql = "SELECT a.contest_id as competition_id, a.name as 'participant_name', b.category_name as category, count(distinct(a.msg_id)) AS 'votes' FROM vote a
                    INNER JOIN category b 
                    WHERE a.date >= ? AND a.date <= DATE_ADD(?, INTERVAL 1 DAY) AND a.contest_id = ?
                    AND a.msg_source = 'mobile_money' AND a.category_id = b.category_id AND b.category_id=?
                    GROUP BY a.name,a.category_id ORDER BY b.category_name";
            $stmt = $con->prepare($sql);
            $stmt->bind_param('ssss', $start_date, $end_date, $competition_id, $category_id);
            $stmt->execute();
            $stmt = $stmt->get_result();
            $result = $stmt->fetch_all(MYSQLI_ASSOC);
            array_push($final_output, $result);
            // 
            $sql = "SELECT count(distinct(a.msg_id)) AS 'votes' FROM vote a
                    INNER JOIN category b 
                    WHERE a.date >= ? AND a.date <= DATE_ADD(?, INTERVAL 1 DAY) AND a.contest_id = ?
                    AND a.msg_source = 'mobile_money' AND a.category_id = b.category_id AND b.category_id=?";
            $stmt1 = $con->prepare($sql);
            $stmt1->bind_param('ssss', $start_date, $end_date, $competition_id, $category_id);
            $stmt1->execute();
            $stmt1 = $stmt1->get_result();
            $result1 = $stmt1->fetch_all(MYSQLI_ASSOC);
            array_push($final_output, $result1);
            echo json_encode($final_output);
        }else{
            $resp = array("data" => "Bad Request. One or more fields empty", "status" => 400);
            http_response_code(400);
            echo json_encode($resp);
        }
       
    }else{
        $resp = array("data" => "User unauthorized", "status" => 401);
        http_response_code(401);
        echo json_encode($resp);
    }
}


function fetch_all_contest_vote($username,$privilege, $output, $con){
    $auth = check_user($username, $privilege,$con);
    if($auth){
        $competition_id=$output['competitionID'];
        $sql = "SELECT * FROM voting.nominees WHERE `contest_id`=? AND is_evicted=FALSE";
            $stmt = $con->prepare($sql);
            $stmt->bind_param('s', $competition_id);
            $stmt->execute();
            $stmt = $stmt->get_result();
            $final_output = array();
            while ($result = $stmt->fetch_assoc()){
                $id = $result['id'];
                $contestant = $result['name'];
                $shortcode = $result['short_code'];
                $c_id = $result['category_id'];

                // 
                $sql = "SELECT `category_name`,`category_short`, `profile`, `category_description` FROM voting.category WHERE `category_id`=?";
                $stmt1 = $con->prepare($sql);
                $stmt1->bind_param('s', $c_id);
                $stmt1->execute();
                $stmt1 = $stmt1->get_result();
                $res = $stmt1->fetch_array();
                $category_name = $res[0];

                // get votes
                $sql = "SELECT distinct(msg_id) FROM voting.vote WHERE `pid`=?";
                $stmt2 = $con->prepare($sql);
                $stmt2->bind_param('s', $id);
                $stmt2->execute();
                $stmt2 = $stmt2->get_result();
                if ($stmt2 != false){
                    $res = number_format($stmt2->num_rows);
                }else {
                    $res = 0;
                }

                $data->contestant_name=$contestant;
                $data->category_name = $category_name;
                $data->shortcode = $shortcode;
                $data->vote_count =$res;
                $data_to_json = json_encode($data);
                array_push($final_output, json_decode($data_to_json));
            } 
            echo json_encode($final_output);
    }else{
        $resp = array("data" => "User unauthorized", "status" => 401);
        http_response_code(401);
        echo json_encode($resp);
    }
}


function fetch_all_category_vote($username,$privilege, $output, $con){
    $auth = check_user($username, $privilege,$con);
    if($auth){
        $category_id=$output['categoryID'];
        $sql = "SELECT * FROM voting.nominees WHERE `category_id`=? AND is_evicted=FALSE";
            $stmt = $con->prepare($sql);
            $stmt->bind_param('s', $category_id);
            $stmt->execute();
            $stmt = $stmt->get_result();
            $final_output = array();
            while ($result = $stmt->fetch_assoc()){
                $id = $result['id'];
                $contestant = $result['name'];
                $shortcode = $result['short_code'];
                $c_id = $result['category_id'];

                // 
                $sql = "SELECT `category_name`,`category_short` FROM voting.category WHERE `category_id`=?";
                $stmt1 = $con->prepare($sql);
                $stmt1->bind_param('s', $c_id);
                $stmt1->execute();
                $stmt1 = $stmt1->get_result();
                $res = $stmt1->fetch_array();
                $category_name = $res[0];

                // get votes
                $sql = "SELECT distinct(msg_id) FROM voting.vote WHERE `pid`=?";
                $stmt2 = $con->prepare($sql);
                $stmt2->bind_param('s', $id);
                $stmt2->execute();
                $stmt2 = $stmt2->get_result();
                if ($stmt2 != false){
                    $res = number_format($stmt2->num_rows);
                }else {
                    $res = 0;
                }

                $data->contestant_name=$contestant;
                $data->category_name = $category_name;
                $data->shortcode = $shortcode;
                $data->vote_count =$res;
                $data_to_json = json_encode($data);
                array_push($final_output, json_decode($data_to_json));
            } 
            echo json_encode($final_output);
    }else{
        $resp = array("data" => "User unauthorized", "status" => 401);
        http_response_code(401);
        echo json_encode($resp);
    }
}

switch ($method) {
    case 'GET':
        $str = $_SERVER['QUERY_STRING'];
        $sql = '';
        $name = '';
        parse_str($str, $output);
        $action = $output['action'];
        $username = $output['username'];
        $password = $output['password'];
        $privilege = $output['privilege'];
        $key = $output['key'];
        
        // decision making
        if($action=='login'){
            login($username, $password, $con);
        }else if($action=='fetchCategory'){
            fetch_category($username,$privilege, $output, $con);
        }else if($action=='fetchCompetitions'){
            fetch_competition($username,$privilege, $output, $con);
        }else if($action=='fetchCompetitionsWithCategory'){
            fetch_competition_with_category($username,$privilege, $output, $con);
        }else if($action=='getAllVote'){
            fetch_all_contest_vote($username,$privilege, $output, $con);
        }else if($action=='getAllCategoryVote'){
            fetch_all_category_vote($username,$privilege, $output, $con);
        }else if($action=='createUser'){
            create_user($username, $password, $privilege, $key, $con);
        }else{
            $resp = array("data" => "Action not defined. Contact Administrator", "status" => 401);
            http_response_code(404);
            echo json_encode($resp);
        }
        
        break;
    
    default:
        $resp = array("data" => "Request not allowed", "status" => 501);
        http_response_code(501);
        echo json_encode($resp);
}



$con->close();