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
    print "JSON: {0}\n".format(json.dumps(result['json_response']))
    print "\n"
    
    if result['passed'] == False:
        raise Exception("TEST FAILED: {0}".format(result['fail_text']))

    return 1  

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
        result['json_response'] = json_response
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
        result['json_response'] = json_response
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
    #if True:
    try:
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
        result['json_response'] = json_response
        if json_response['success'] == True and json_response['assignment_id'] != '':
            assignment_id = json_response['assignment_id']
            result['passed'] = True
        else:
            result['fail_text'] = "Assignment was not published successfully.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

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
        client_id,
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
    assignments = None
    #if True:
    try:
        #http_response = urllib2.urlopen(url).read()
        http_response = requests.get(url).text
        json_response = json.loads(http_response)
        result['json_response'] = json_response
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

    result['json_response'] = ''

    start_time = time.time()

    try:
    #if True:

        answers = json.loads(question_data['answers'])

        if len(valid_assignments) == 0:
            result['fail_text'] = "Returned assignments array is empty."
            raise Exception('error')

        if int(valid_assignments[0]['assignment_id']) != int(assignment_id):
            result['fail_text'] = "Returned assignment_id was invalid."
            raise Exception('error')        

        if valid_assignments[0]['question_text'] != question_data['question_text']:
            result['fail_text'] = "question_text did not match"
            raise Exception('error')

        if valid_assignments[0]['question_type_id'] != 2:
            result['fail_text'] = "question_type_id did not equal 2 (multiple choice)."
            raise Exception('error')

        if float(valid_assignments[0]['top_left_lat']) != float(assignment_data['top_left_lat']):
            result['fail_text'] = "top_left_lat did not match."
            raise Exception('error')
  
        if float(valid_assignments[0]['top_left_lng']) != float(assignment_data['top_left_lng']):
            result['fail_text'] = "top_left_lng did not match."
            raise Exception('error')

        if float(valid_assignments[0]['bottom_right_lat']) != float(assignment_data['bottom_right_lat']):
            result['fail_text'] = "bottom_right_lat did not match."
            raise Exception('error')

        if float(valid_assignments[0]['bottom_right_lng']) != float(assignment_data['bottom_right_lng']):
            result['fail_text'] = "bottom_right_lng did not match."
            raise Exception('error')

        if valid_assignments[0]['answer0'] != answers[0]:
            result['fail_text'] = "answer0 did not match."
            raise Exception('error')

        if valid_assignments[0]['answer1'] != answers[1]:
            result['fail_text'] = "answer1 did not match."
            raise Exception('error')
        
        if valid_assignments[0]['answer2'] != answers[2]:
            result['fail_text'] = "answer2 did not match."
            raise Exception('error')
        
        if len(invalid_assignments) != 0:
            result['fail_text'] = "invalid_assignments was not zero in lengths"
            raise Exception('error')            

        result['passed'] = True

    except Exception, e:
        if not 'fail_text' in result:
            result['fail_text'] = "General error: {0}".format(e)

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result

def admin_get_languages(root_domain, token):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/get_languages.json"
    result['description'] = "Gets a list of available languages."

    url = "{0}/admin/get_languages.json?token={1}".format(
        root_domain,
        token,
    )

    start_time = time.time()
    languages = None
    #if True:
    try:
        http_response = requests.get(url).text
        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            languages = json_response['languages']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to get list of languages.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, languages

def admin_get_question_types(root_domain, token):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/get_question_types.json"
    result['description'] = "Gets a list of available question types."

    url = "{0}/admin/get_question_types.json?token={1}".format(
        root_domain,
        token,
    )

    start_time = time.time()
    question_types = None
    #if True:
    try:
        http_response = requests.get(url).text
        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            question_types = json_response['question_types']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to get list of question types.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, question_types

def admin_create_user(root_domain, token):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/create_user.json"
    result['description'] = "Creates a new user."

    url = "{0}/admin/create_user.json?token={1}".format(
        root_domain,
        token,
    )

    user_data = dict(
        user_name = 'newuser',
        password = 'awesome',
        user_type = 'subscriber',
        first_name = 'bob',
        last_name = 'smith',
        email = 'bob@smith.com',
        organization = 'Acme, Inc.'
    )

    start_time = time.time()
    question_types = None
    #if True:
    try:
        http_response = requests.post(url, data=user_data).text
        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            #question_types = json_response['question_types']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to create new user.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, user_data

def upload_media(root_domain, client_id):

    result = {}
    result['passed'] = False
    result['test_name'] = "upload_media.json"
    result['description'] = "Upload an image to the server."

    url = "{0}/upload_media.json?token".format(
        root_domain,
        token,
    )

    start_time = time.time()
    media_data = None
    media_object_id = None
    if True:
    #try:
        with open('smiley.png') as smiley_file:
            media_data = {
                'client_id': client_id,
                'media_type': 'image',
                #'media_file': smiley_file,
                'media_caption': 'SMILE!',
            }
            http_response = requests.post(url, data=media_data, files={'media_file': smiley_file}).text

        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            media_id = json_response['media_id']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to upload media object.  Error: '{0}'.".format(json_response['error_text'])
    #except:
    #    result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, media_data, media_id

def publish_post(root_domain, client_id, assignment_id, media_id):

    #print "\nThis client_id is being sent to the server:\n"
    #print client_id
    #print "\n\n"

    result = {}
    result['passed'] = False
    result['test_name'] = "publish_post.json"
    result['description'] = "Publish a post."

    url = "{0}/publish_post.json?token".format(
        root_domain,
        token,
    )

    start_time = time.time()
    post_data = None
    post_id = None
    if True:
    #try:
        with open('smiley.png') as smiley_file:
            post_data = {
                'client_id': client_id,
                'assignment_id': assignment_id,
                'title': 'My post!',
                'language_code': 'en',
                'lat': 43.1,
                'lng': -77.5,
                'media_objects': '%5B%22{0}%22%5D'.format(media_id),
            }
            http_response = requests.post(url, data=post_data).text

        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            post_id = json_response['post_id']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to publish post.  Error: '{0}'.".format(json_response['error_text'])
    #except:
    #    result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, post_data, post_id

def admin_get_assignment_responses(root_domain, token, assignment_id):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/get_assignment_responses.json"
    result['description'] = "Gets all of the posts that are in response to an assignment."

    url = "{0}/admin/get_assignment_responses.json?token={1}&assignment_id={2}".format(
        root_domain,
        token,
        assignment_id,
    )

    start_time = time.time()
    posts = None
    #if True:
    try:
        http_response = requests.get(url).text
        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            posts = json_response['posts']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to get response posts.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, posts

def test_assignment_responses(posts, post_data, client_id):

    result = {}
    result['passed'] = False
    result['test_name'] = "test_assignment_responses"
    result['description'] = "Tests to make sure the test post was posted correctly."

    result['json_response'] = ''

    start_time = time.time()
    if True:
    #try:
   
        #print "\n\n"
        #print posts
        #print "\n\n"

        #print client_id
        #print "\n\n"
 
        if posts == None:
            result['fail_text'] = "Posts array was None.."
            raise Exception('error')

        for post_id, post in posts.iteritems():

            if post['language_code'] != post_data['language_code']:
                result['fail_text'] = "Language code did not match."
                raise Exception('error')

            if post['title'] != post_data['title']:
                result['fail_text'] = "The post title did not match."
                raise Exception('error')

            if post['lat'] != post_data['lat']:
                result['fail_text'] = "The post latitude did not match."
                raise Exception('error')
             
            if post['lng'] != post_data['lng']:
                result['fail_text'] = "The post longitude did not match"
                raise Exception('error')

            if post['assignment_id'] != post_data['assignment_id']:
                result['fail_text'] = "The post assignment ID did not match."
                raise Exception('error')

            if post['client_id'] != client_id:
                result['fail_text'] = "The client ID did not match."
                raise Exception('error')

            

            break

        result['passed'] = True

    #except Exception, e:
    #    if not 'fail_text' in result:
    #        result['fail_text'] = "General error: {0}".format(e)

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result

def admin_create_collection(root_domain, token):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/create_collection.json"
    result['description'] = "Creates a new collection."

    url = "{0}/admin/create_collection.json?token={1}".format(
        root_domain,
        token,
    )

    user_data = dict(
        name = 'My First Collection',
        description = 'A collection that I will put posts in.',
        tags = 'first, yellr, posts, awesome',
    )

    start_time = time.time()
    collection_id = None
    #if True:
    try:
        http_response = requests.post(url, data=user_data).text
        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            collection_id = json_response['collection_id']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to create collection.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, collection_id

def admin_get_my_collections(root_domain, token):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/get_my_collections.json"
    result['description'] = "Gets all of the posts that are in response to an assignment."

    url = "{0}/admin/get_my_collections.json?token={1}".format(
        root_domain,
        token,
    )

    start_time = time.time()
    posts = None
    #if True:
    try:
        http_response = requests.get(url).text
        print http_response
        json_response = json.loads(http_response)

        result['json_response'] = json_response
        if json_response['success'] == True:
            collections = json_response['collections']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to get list of collections.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, posts

def get_messages(root_domain, client_id):

    result = {}
    result['passed'] = False
    result['test_name'] = "get_messages.json"
    result['description'] = "Gets a list of messages."

    url = "{0}/get_messages.json?client_id={1}".format(
        root_domain,
        client_id,
    )

    start_time = time.time()
    messages = None
    #if True:
    try:
        #http_response = urllib2.urlopen(url).read()
        http_response = requests.get(url).text
        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            messages = json_response['messages']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to get list of messages.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, messages 

def admin_get_my_messages(root_domain, token):

    result = {}
    result['passed'] = False
    result['test_name'] = "admin/get_messages.json"
    result['description'] = "Gets a list of admin messages."

    url = "{0}/admin/get_my_messages.json?token={1}".format(
        root_domain,
        token,
    )

    start_time = time.time()
    messages = None
    #if True:
    try:
        #http_response = urllib2.urlopen(url).read()
        http_response = requests.get(url).text
        print http_response
        json_response = json.loads(http_response)
        result['json_response'] = json_response
        if json_response['success'] == True:
            messages = json_response['messages']
            result['passed'] = True
        else:
            result['fail_text'] = "Unable to get list of messages.  Error: '{0}'.".format(json_response['error_text'])
    except:
        result['fail_text'] = "Failed to load JSON response from server."

    end_time = time.time()

    result['total_time'] = end_time - start_time

    return result, messages


if __name__ == '__main__':

    print "Welcome to Yellr automated test suite.\n\n"

    if len(sys.argv) != 4:
        print "Usage:\n\n\tpython yellr-serv-tests.py <root_domain> \
<user_name> <password>\n"
    else:

        root_domain = sys.argv[1]
        user_name = sys.argv[2]
        password = sys.argv[3]
        
        count = 0
        client_id = str(uuid.uuid4())

        print "Using client_id: {0}".format(client_id)

        result, token = admin_get_access_token(
            root_domain,
            user_name,
            password,
        )
        count += declare_result(result) 
        
        result, question_data, question_id = admin_create_question(
            root_domain,
            token,
        )
        count += declare_result(result)
    
        result, assignment_data, assignment_id = admin_publish_assignment(
            root_domain,
            token,
            question_id,
        )
        count += declare_result(result)

        result, assignment_data_valid, assignments_valid = get_assignments(
            root_domain,
            client_id,
            'en',
            43.1,
            -77.5,
        )
        count += declare_result(result)

        result, assignment_data_invalid, assignments_invalid = get_assignments(
            root_domain,
            client_id,
            'en',
            54.7,
            100.1,
        )
        count += declare_result(result)

        result = test_assignment_response(
            question_data,
            question_id, 
            assignment_data,
            assignment_id,
            assignments_valid,
            assignments_invalid,
        )
        count += declare_result(result)

        result, languages = admin_get_languages(
            root_domain,
            token,
        )
        count += declare_result(result)

        result, question_types = admin_get_question_types(
            root_domain,
            token,
        )
        count += declare_result(result)

        result, user_data = admin_create_user(
            root_domain,
            token,
        )
        count += declare_result(result)

        result, test_user_token = admin_get_access_token(
            root_domain,
            user_data['user_name'],
            user_data['password'],
        )
        count += declare_result(result) 

        result, media_data, media_id = upload_media(
            root_domain,
            client_id,
        )
        count += declare_result(result)

        result, post_data, post_id = publish_post(
            root_domain,
            client_id,
            assignment_id,
            media_id,
        )
        count += declare_result(result)

        result, posts = admin_get_assignment_responses(
            root_domain,
            token,
            assignment_id,
        )
        count += declare_result(result)

        result = test_assignment_responses(
            posts,
            post_data,
            client_id,
        )
        count += declare_result(result)

        result,collection_id = admin_create_collection(
            root_domain,
            token,
        )
        count += declare_result(result)

        result,collections = admin_get_my_collections(
            root_domain,
            token,
        )
        count += declare_result(result)

        result,messages = get_messages(
            root_domain,
            client_id,
        )
        count += declare_result(result)

        result,messages = admin_get_my_messages(
            root_domain,
            token,
        )
        count += declare_result(result)

        print "----------------"
        print "{0}/{0} Tests passed.\n\n".format(count) 
