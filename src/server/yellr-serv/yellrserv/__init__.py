from pyramid.config import Configurator
from pyramid.renderers import JSONP
from sqlalchemy import engine_from_config

from .models import (
    DBSession,
    Base,
    )


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')

    config.add_renderer('jsonp', JSONP(param_name='callback'))
    config.add_route('json_test', 'json_test')

    config.add_static_view('static', 'static', cache_max_age=3600)

    config.add_route('index.html', '/')
    config.add_route('status.json','status.json')
    config.add_route('client_logs.json','client_logs.json')  
    config.add_route('get_messages.json','get_messages.json')
    config.add_route('upload_media.json','upload_media.json')
    config.add_route('upload_test.json','upload_test.json')
    config.add_route('publish_post.json','publish_post.json')
    #config.add_route('','')

    config.scan()
    return config.make_wsgi_app()
