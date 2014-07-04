from pyramid.config import Configurator
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
    config.add_static_view('static', 'static', cache_max_age=3600)

    config.add_route('index.html', '/')
    config.add_route('status.json','status.json')
    config.add_route('uploadmedia.json','uploadmedia.json')
    config.add_route('uploadtest.json','uploadtest.json')
    config.add_route('publishpost.json','publishpost.json')
    #config.add_route('','')

    config.scan()
    return config.make_wsgi_app()
