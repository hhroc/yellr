import os
import json
from time import strftime
import uuid
import datetime

from utils import make_response

import urllib

import transaction

from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    UserTypes,
    Users,
    Assignments,
    Questions,
    QuestionTypes,
    QuestionAssignments,
    Languages,
    Posts,
    MediaTypes,
    MediaObjects,
    PostMediaObjects,
    Stories,
    EventLogs,
    Collections,
    CollectionPosts,
    Messages,
    Notifications,
    )

def check_token(token):
    """ validates token against database """
    valid, user = Users.validate_token(DBSession, token)
    return valid, user


@view_config(route_name='admin/get_access_token.json')
def get_access_token(request):

    result = {'success': False}

    try:
    #if True:

        try:
            user_name = request.GET['user_name']
            password = request.GET['password']
        except:
            result['error_text'] = "Missing 'user_name' or 'password' within request"
            raise Exception('missing credentials')

        print "working on u: '{0}', p: '{1}'".format(user_name, password)

        token = Users.authenticate(DBSession, user_name, password)

        if token == None:
            result['error_text'] = 'Invalid credentials'
            raise Exception('invalid credentials')
        else:
            result['token'] = token

        result['success'] = True

    except Exception, e:
        pass

    return make_response(result)

@view_config(route_name='admin/get_posts.json')
def admin_get_posts(request):

    """ Will return current posts from database """

    result = {'success': False}

    try:
    #if True:

        token = None
        valid_token = False
        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        start = 0
        try:
            start = int(request.GET['start'])
        except:
            pass

        count = 50
        try:
            count = int(request.GET['count'])
        except:
            pass

        reported = False
        try:
             reported = bool(int(request.GET['count']))
        except:
            pass

        posts, total_post_count = Posts.get_posts(
            DBSession,
            reported = reported,
            start = start,
            count = count,
        )

        ret_posts = []
        for post_id, title, post_datetime, reported, lat, lng, assignment_id, \
                verified, client_id, first_name, last_name, organization, \
                language_code, language_name in posts:

            media_objects = MediaObjects.get_from_post_id(DBSession, post_id)
            ret_media_objects = []
            for file_name, caption, media_text, media_type, media_description \
                    in media_objects:
                ret_media_objects.append({
                    'file_name': file_name,
                    'caption': caption,
                    'media_text': media_text,
                    'media_type': media_type,
                    'media_description': media_description,
                })
            ret_posts.append({
                'title': title,
                'datetime': str(post_datetime),
                'reported': reported,
                'lat': lat,
                'lng': lng,
                'verified_user': verified, 
                'client_id': client_id,
                'first_name': first_name,
                'last_name': last_name,
                'organization': organization,
                'media_objects': ret_media_objects,
            })

        result['total_post_count'] = total_post_count
        result['posts'] = ret_posts

        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/create_question.json')
def admin_create_question(request):

    result = {'success': False}

    #if True:
    try:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        #if True:
        try:
            language_code = request.POST['language_code']
            question_text = request.POST['question_text']
            question_type = request.POST['question_type']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: language_code, \
question_text, question_type. \
"""
            raise Exception('missing field')

        # answers is a json array of strings 
        answers = []
        try:
        #if True:
            answers = json.loads(request.POST['answers'])
        except:
            pass
        # back fill with empty strings
        for i in range(len(answers),10):
            answers.append('')

        print "\nAnswers:"
        print answers

        question = Questions.create_from_http(
            DBSession,
            language_code,
            question_text,
            question_type,
            answers,
        )
 
        result['question_id'] = question.question_id 
        result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/publish_assignment.json')
def admin_publish_assignment(request):

    result = {'success': False}

    try:
    #if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')


        #if True:
        try:
            #client_id = request.POST['client_id']
            life_time = int(request.POST['life_time'])
            questions = json.loads(request.POST['questions'])
            top_left_lat = float(request.POST['top_left_lat'])
            top_left_lng = float(request.POST['top_left_lng'])
            bottom_right_lat = float(request.POST['bottom_right_lat'])
            bottom_right_lng = float(request.POST['bottom_right_lng'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: life_time,\
questions (JSON list of question id's), top_left_lat, top_left_lng, \
bottom_right_lat, bottom_right_lng.
"""
            raise Exception('invalid/missing field')

        geo_fence = {
            'top_left_lat': top_left_lat,
            'top_left_lng': top_left_lng,
            'bottom_right_lat': bottom_right_lat,
            'bottom_right_lng': bottom_right_lng,
        }

        # create assignment
        assignment = Assignments.create_from_http(
            session = DBSession,
            token = token,
            life_time = life_time,
            geo_fence = geo_fence,
        )

        # assign question to assignment
        for question_id in questions:
            QuestionAssignments.create(
                DBSession,
                assignment.assignment_id,
                question_id,
            )

        result['assignment_id'] = assignment.assignment_id

        result['success'] = True

    except:
        pass


    return make_response(result)

@view_config(route_name='admin/update_assignment.json')
def admin_update_assignment(request):

    result = {'success': False}

    #try:
    if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')


        if True:
        #try:
            assignment_id = request.POST['assignment_id']
            #client_id = request.POST['client_id']
            life_time = int(request.POST['life_time'])
            #questions = json.loads(request.POST['questions'])
            top_left_lat = float(request.POST['top_left_lat'])
            top_left_lng = float(request.POST['top_left_lng'])
            bottom_right_lat = float(request.POST['bottom_right_lat'])
            bottom_right_lng = float(request.POST['bottom_right_lng'])
            #use_fence = boolean(request.POST['use_fence'])
#        except:
#            result['error_text'] = """\
#One or more of the following fields is missing or invalid: life_time, \
#top_left_lat, top_left_lng, bottom_right_lat, bottom_right_lng. \
#"""
#            raise Exception('invalid/missing field')

        # create assignment
        assignment = Assignments.update_assignment(
            session = DBSession,
            assignment_id = assignment_id,
            life_time = life_time,
            top_left_lat = top_left_lat,
            top_left_lng = top_left_lng,
            bottom_right_lat = bottom_right_lat,
            bottom_right_lng = bottom_right_lng,
            #use_fence = use_fence,
        )

        result['assignment_id'] = assignment.assignment_id
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/create_message.json')
def admin_create_message(request):

    result = {'success': False}

    try:
    #if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')
 
        try:
            to_client_id = request.POST['to_client_id']
            subject = request.POST['subject']
            text = request.POST['text']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: to_client_id, \
subject, text.
"""
            raise Exception('invalid/missing field')
        
        parent_message_id = None
        try:
            parent_message_id = request.POST['parent_message_id']
        except:
            pass

        message = Messages.create_message_from_http(
            session = DBSession,
            from_token = token,
            to_client_id = to_client_id,
            subject = subject,
            text = text,
            parent_message_id = parent_message_id,
        )

        if message != None:
            result['message_id'] = message.message_id
            result['success'] = True

    except:
        pass

    return make_response(result)

@view_config(route_name='admin/get_languages.json')
def admin_get_languages(request):

    result = {'success': False}

    #try:
    if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        languages = Languages.get_all(DBSession)

        ret_languages = []
        for language_code, name in languages:
            ret_languages.append({
                'name': name,
                'code': language_code,
            })

        result['languages'] = ret_languages
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/get_question_types.json')
def admin_get_question_types(request):

    result = {'success': False}

    #try:
    if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        question_types = QuestionTypes.get_all(DBSession)

        ret_question_types = []
        for question_type_id, question_type_text, question_type_description \
                in question_types:
            ret_question_types.append({
                'question_type_id': question_type_id,
                'question_type_text': question_type_text,
                'question_type_description': question_type_description,
            })

        result['question_types'] = ret_question_types
        result['success'] = True

    #except:
    #    pass

    return make_response(result)


@view_config(route_name='admin/create_user.json')
def admin_create_user(request):

    result = {'success': False}

    #try:
    if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        try:
            user_type_text = request.POST['user_type']
            user_name = request.POST['user_name']
            password = request.POST['password']
            first_name = request.POST['first_name']
            last_name = request.POST['last_name']
            email = request.POST['email']
            organization = request.POST['organization']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: user_type, \
user_name, password, first_name, last_name, email, organization. \
"""
            raise Exception('invalid/missing field')

        user_type = UserTypes.get_from_name(DBSession, user_type_text)
        user = Users.create_new_user(
            session = DBSession,
            user_type_id = user_type.user_type_id,
            client_id = str(uuid.uuid4()),
        )

        user = Users.verify_user(
            session = DBSession,
            client_id = user.client_id,
            user_name = user_name,
            password = password,
            first_name = first_name,
            last_name = last_name,
            email = email, 
        )

        result['user_id'] = user.user_id
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/get_assignment_responses.json')
def admin_get_assignment_responses(request):

    result = {'success': False}

    #try:
    if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        try:
            assignment_id = int(request.GET['assignment_id'])
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid: assignment_id. \
"""
            raise Exception('invalid/missing field')
 
        start=0
        try:
            start = int(request.GET['start'])
        except:
            pass

        count=0
        try:
            count = int(request.GET['count'])
        except:
            pass

        posts,post_count = Posts.get_all_from_assignment_id(
            session = DBSession,
            assignment_id = assignment_id,
            start = start,
            count = count,
        )

        print "\n"
        print posts
        print "\n"

        index = 0
        ret_posts = {}
        for post_id, assignment_id, user_id, title, post_datetime, reported, \
                lat, lng, media_object_id, media_id, file_name, caption, \
                media_text, media_type_name, media_type_description, \
                verified, client_id, language_code, language_name in posts:
            if post_id in ret_posts:
                ret_posts[post_id]['media_objects'].append({
                    'media_id': media_id,
                    'file_name': file_name,
                    'caption': caption,
                    'media_text': media_text,
                    'media_type_name': media_type_name,
                    'media_type_description': media_type_description,
                })
            else:
                ret_posts[post_id] = {
                    'post_id': post_id,
                    'assignment_id': assignment_id,
                    'user_id': user_id,
                    'title': title,
                    'post_datetime': str(post_datetime),
                    'reported': reported,
                    'lat': lat,
                    'lng': lng,
                    'verified_user': bool(verified),
                    'client_id': client_id,
                    'language_code': language_code,
                    'language_name': language_name,
                    'media_objects': [{
                        'media_id': media_id,
                        'file_name': file_name,
                        'caption': caption,
                        'media_text': media_text,
                        'media_type_name': media_type_name,
                        'media_type_description': media_type_description,
                    }],
                } 

        result['post_count'] = post_count
        result['posts'] = ret_posts
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

@view_config(route_name='admin/publish_story.json')
def admin_publish_story(request):

    result = {'success': False}

    #try:
    if True:

        try:
        #if True:
            token = request.GET['token']
            valid_token, user = check_token(token)
        except:
            result['error_text'] = "Missing 'token' field in request."
            raise Exception('missing token')

        if valid_token == False:
            result['error_text'] = 'Invalid auth token.'
            raise Exception('invalid token')

        try:
            title = request.POST['title']
            tags = request.POST['tags']
            top_text = request.POST['top_text']
            banner_media_id = request.POST['banner_media_id']
            contents = request.POST['contents']
            top_left_lat = float(request.POST['top_left_lat'])
            top_left_lng = float(request.POST['top_left_lng'])
            bottom_right_lat = float(request.POST['bottom_right_lat'])
            bottom_right_lng = float(request.POST['bottom_right_lng'])
            language_code = request.POST['language_code']
            #use_fense = request.POST['use_fense']
        except:
            result['error_text'] = """\
One or more of the following fields is missing or invalid:  \
"""
            raise Exception('invalid/missing field')

        story = Stories.create_from_http(
            session = DBSession,
            token = token,
            title = title,
            tags = tags,
            top_text = top_text,
            media_id = banner_media_id,
            contents = contents,
            top_left_lat = top_left_lat,
            top_left_lng = top_left_lng,
            bottom_right_lat = bottom_right_lat,
            bottom_right_lng = bottom_right_lng,
            #use_fence = use_fense,
            language_code = language_code,
        ) 

        result['story_unique_id'] = story.story_unique_id
        result['success'] = True

    #except:
    #    pass

    return make_response(result)

