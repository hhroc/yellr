from pyramid.config import Configurator
from pyramid.renderers import JSONP
from sqlalchemy import engine_from_config

from .models import (
    DBSession,
    Base,
    )

from config import system_config

import os
print os.path.dirname(os.path.realpath(__file__))

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')

    #config.add_renderer('jsonp', JSONP(param_name='callback'))
    #config.add_route('json_test', 'json_test')

    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_static_view('moderator','moderator')

    # decode upload dir based on relative path or not
    if system_config['upload_dir'][0] == '/':
        media_path = system_config['upload_dir']
    else:
        media_path = '../{0}'.format(system_config['upload_dir'])

    config.add_static_view(name='media', path=media_path)



    # template views
    config.add_route('index', '/')
    config.add_route('submit-tip.html','submit-tip.html')

    # admin views
    config.add_route('admin/get_access_token.json', 'admin/get_access_token.json')

    config.add_route('admin/get_client_logs.json', 'admin/get_client_logs.json')
    config.add_route('admin/get_posts.json', 'admin/get_posts.json')
    config.add_route('admin/create_question.json', 'admin/create_question.json')
    config.add_route('admin/update_question.json', 'admin/update_question.json')
    config.add_route('admin/publish_assignment.json', 'admin/publish_assignment.json')
    config.add_route('admin/update_assignment.json', 'admin/update_assignment.json')
    config.add_route('admin/get_my_assignments.json', 'admin/get_my_assignments.json')
    config.add_route('admin/create_message.json', 'admin/create_message.json')
    config.add_route('admin/get_my_messages.json', 'admin/get_my_messages.json')
    config.add_route('admin/get_languages.json', 'admin/get_languages.json')
    config.add_route('admin/get_question_types.json', 'admin/get_question_types.json')
    config.add_route('admin/create_user.json', 'admin/create_user.json')
    config.add_route('admin/get_assignment_responses.json', \
        'admin/get_assignment_responses.json')
    config.add_route('admin/register_post_view.json','admin/register_post_view.json')
    config.add_route('admin/publish_story.json', 'admin/publish_story.json')
    config.add_route('admin/get_my_collections.json', 'admin/get_my_collections.json')
    config.add_route('admin/create_collection.json', 'admin/create_collection.json')
    config.add_route('admin/add_post_to_collection.json', 'admin/add_post_to_collection.json')
    config.add_route('admin/remove_post_from_collection.json', 'admin/remove_post_from_collection.json')
    config.add_route('admin/disable_collection.json', 'admin/disable_collection.json')
    config.add_route('admin/get_collection_posts.json', 'admin/get_collection_posts.json')
    config.add_route('admin/get_user_posts.json','admin/get_user_posts.json')
    config.add_route('admin/get_subscriber_list.json','admin/get_subscriber_list.json')
    config.add_route('admin/creae_user.json','admin/create_user.json')

    # client views
    #config.add_route('server_info.json','server_info.json')
    config.add_route('create_response_message.json', \
        'create_response_message.json')
    config.add_route('get_assignments.json','get_assignments.json')
    config.add_route('get_messages.json','get_messages.json')
    config.add_route('get_notifications.json','get_notifications.json')
    #config.add_route('get_posts.json','get_posts.json')
    config.add_route('get_stories.json', 'get_stories.json')
    config.add_route('upload_media.json','upload_media.json')
    config.add_route('upload_test.json','upload_test.json')
    config.add_route('publish_post.json','publish_post.json')
    config.add_route('get_profile.json', 'get_profile.json')
    
    config.scan()
    return config.make_wsgi_app()
