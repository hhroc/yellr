import sys
import urllib2
import urllib
import json
import time
import uuid
import requests


def declare_result(result):

    print "----------------"
    print "{0}".format(result['test_name'])
    print "\t{0}".format(result['description'])
    print "----------------"
    print "Test executed in {0} seconds".format(result['total_time'])
    print "Passed: {0}\n".format(result['passed'])
    print "\n"
    
    if result['passed'] == False:
        raise Exception("TEST FAILED: {0}".format(result['fail_text']))

def admin_get_access_token(root_domain, user_name, password):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/get_access_token.json"
    result['description'] = "Get an authorization token from the server"

    url = "{0}/admin/get_access_token.json?user_name={1}&password={2}".format(
        root_domain,
        user_name,
        password,
    )
    
    start_time = time.time()
    token = None
    try:
        #http_response = urllib2.urlopen(url).read()
        http_response = requests.get(url).text
        json_response = json.loads(http_response)
        if json_response['success'] == True and json_response['token'] != "":
            token = json_response['token']
            result['passed'] = True
        else:
            result['fail_text'] = "Token was not returned successfully.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."
    end_time = time.time()
    result['total_time'] = end_time - start_time

    return result, token

def admin_create_question(root_domain, token):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/create_question.json"
    result['description'] = "Create a question within the database"

    url = "{0}/admin/create_question.json?token={1}".format(
        root_domain,
        token,
    )

    start_time = time.time()
    question_data = None
    question_id = None
    #if True:
    try:
        question_data = {
            'language_code': 'en',
            'question_text': 'Can you hear me now?',
            'description': 'Can you hear me from my mobile device?',
            'question_type': 'multiple_choice',
            'answers': '["Yes","No","Please leave me alone"]',
        }
        #http_response = urllib2.urlopen(url, urllib.urlencode(question_data)).read()
        http_response = requests.post(url, data=question_data).text
        json_response = json.loads(http_response)
        if json_response['success'] == True and json_response['question_id'] != '':
            question_id = json_response['question_id']
            result['passed'] = True
        else:
            result['fail_text'] = "Quesiton was not created successfully.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, question_data, question_id

def admin_publish_assignment(root_domain, token, question_id):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/publish_assignment.json"
    result['description'] = "Publish an assignment with question."

    url = "{0}/admin/publish_assignment.json?token={1}".format(
        root_domain,
        token,
    )

    start_time = time.time()
    assignment_data = None
    assignment_id = None
    if True:
    #try:
        assignment_data = {
            'life_time': 30,
            'questions': '["{0}"]'.format(question_id),
            'top_left_lat': 43.4,
            'top_left_lng': -77.9,
            'bottom_right_lat': 43.0,
            'bottom_right_lng': -77.3,
        }
        #http_response = urllib2.urlopen(url, urllib.urlencode(assignment_data)).read()
        http_response = requests.post(url, data=assignment_data).text
        json_response = json.loads(http_response)
        if json_response['success'] == True and json_response['assignment_id'] != '':
            assignment_id = json_response['assignment_id']
            result['passed'] = True
        else:
            result['fail_text'] = "Assignment was not published successfully.  Error: '{0}'.".format(json_response['error_text'])
    #except:
    #    result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, assignment_data, assignment_id

def get_assignments(root_domain, client_id, language_code, lat, lng):

    result = {}
    result['passed'] = False
    result['test_name'] = "get_assignments.json"
    result['description'] = "Gets a list of open assignments from the server."

    url = "{0}/get_assignments.json?client_id={1}&language_code={2}&lat={3}&lng={4}".format(
        root_domain,
        token,
        language_code,
        lat,
        lng,
    )

    assignment_data = dict(
        language_code = language_code,
        lat = lat,
        lng = lng,
    )

    start_time = time.time()
    assignment_id = None
    #if True:
    try:
        #http_response = urllib2.urlopen(url).read()
        http_response = requests.get(url).text
        json_response = json.loads(http_response)
        if json_response['success'] == True:
            assignments = json_response['assignments']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to get list of open assignments.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, assignment_data, assignments

def test_assignment_response(question_data, question_id, assignment_data, \
        assignment_id, valid_assignments, invalid_assignments):

    result = {}
    result['passed'] = False
    result['test_name'] = "test_assignment_response"
    result['description'] = "Checks to make sure assignment was created correctly, and responses are correct." 

    start_time = time.time()

    #try:
    if True:

        print question_data
        print ""

        print assignment_data
        print ""

        print assignment_id
        print ""

        print valid_assignments
        print ""
 
        print invalid_assignments
        print ""

        answers = json.loads(question_data['answers'])

        print answers
        print ""

        if len(valid_assignments) != 0 and \
                valid_assignments[0]['assignment_id'] == assignment_id and \
                valid_assignments[0]['question_text'] == question_data['question_text'] and \
                valid_assignments[0]['question_type_id'] == 2 and \
                valid_assignments[0]['top_left_lat'] == assignment_data['top_left_lat'] and \
                valid_assignments[0]['top_left_lng'] == assignment_data['top_left_lng'] and \
                valid_assignments[0]['bottom_right_lat'] == assignment_data['bottom_right_lat'] and \
                valid_assignments[0]['bottom_right_lng'] == assignment_data['bottom_right_lng'] and \
                valid_assignments[0]['answers0'] == answers[0] and \
                valid_assignments[0]['answers1'] == answers[1] and \
                valid_assignments[0]['answers2'] == answers[2] and \
                len(invalid_assignments) == 0:
            result['passed'] = True
        else:
            result['fail_text'] = "No match."

    #except:
    #    result['fail_text'] = "Missing keys within test dicts. \nassignments: {0}\nquestion_data: {1}\nassignment_data: {2}".format(
    #        valid_assignments, question_data, assignment_data
    #    )
    #    pass

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result

if __name__ == '__main__':

    print "Welcome to Yellr automated test suite.\n\n"

    if len(sys.argv) != 4:
        print "Usage:\n\n\tpython yellr-serv-tests.py <root_domain> \
<user_name> <password>\n"
    else:

        root_domain = sys.argv[1]
        user_name = sys.argv[2]
        password = sys.argv[3]

        client_id = str(uuid.uuid4())

        result, token = admin_get_access_token(
            root_domain,
            user_name,
            password,
        )
        declare_result(result)
    
        
        result, question_data, question_id = admin_create_question(
            root_domain,
            token,
        )
        declare_result(result)
    
        result, assignment_data, assignment_id = admin_publish_assignment(
            root_domain,
            token,
            question_id,
        )
        declare_result(result)

        result, assignment_data_valid, assignments_valid = get_assignments(
            root_domain,
            client_id,
            'en',
            43.1,
            -77.5,
        )
        declare_result(result)

        result, assignment_data_invalid, assignments_invalid = get_assignments(
            root_domain,
            client_id,
            'en',
            54.7,
            100.1,
        )
        declare_result(result)

        result = test_assignment_response(
            question_data,
            question_id, 
            assignment_data,
            assignment_id,
            assignments_valid,
            assignments_invalid,
        )
        declare_result(result)
