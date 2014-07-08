import os
import sys
import transaction

from sqlalchemy import engine_from_config

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from ..models import (
    DBSession,
    #MyModel,
    UserTypes,
    MediaTypes,
    Languages,
    Base,
    )


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.create_all(engine)
    with transaction.manager:
        #
        # User Types
        #
        usertype_admin = UserTypes(
            usertypedescription = 'A system administrator.  This user type has the highest level of permissions.',
            usertypevalue = 'admin',
        )
        DBSession.add(usertype_admin)
        usertype_mod = UserTypes(
            usertypedescription = 'A system moderator.  This user type moderators content produced by users.',
            usertypevalue = 'moderator',
        )
        DBSession.add(usertype_mod)
        usertype_sub = UserTypes(
            usertypedescription = 'A system subscriber.  This user type uses content produced by moderators and users.',
            usertypevalue = 'subscriber',
        )
        DBSession.add(usertype_sub)
        usertype_user = UserTypes(
            usertypedescription = 'A basic user.  Accesses the system via mobile app or webpage.',
            usertypevalue = 'user',
        )
        DBSession.add(usertype_user)

        #
        # Media Types
        #
        mediatype_image = MediaTypes(
            mediatypedescription = 'An Image.',
            mediatypevalue = 'image',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            mediatypedescription = 'An Audio Clip.',
            mediatypevalue = 'audio',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            mediatypedescription = 'A Video.',
            mediatypevalue = 'video',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            mediatypedescription = 'Text.',
            mediatypevalue = 'text',
        )
        DBSession.add(mediatype_image)

        # Languages
        language_english = Languages(
            languagecode = 'en',
            languagename = 'English',
        )
        DBSession.add(language_english)
        language_spanish = Languages(
            languagecode = 'sp',
            languagename = 'Spanish',
        )
        DBSession.add(language_spanish)

        # commit new objects to the database
        transaction.commit()

