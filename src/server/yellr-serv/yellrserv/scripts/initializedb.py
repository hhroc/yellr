import os
import sys
import uuid

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
    Users,
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
        usertype_system = UserTypes(
            description = 'The system user.',
            name = 'system',
        )
        DBSession.add(usertype_system)
        usertype_admin = UserTypes(
            description = 'A system administrator.  This user type has the highest level of permissions.',
            name = 'admin',
        )
        DBSession.add(usertype_admin)
        usertype_mod = UserTypes(
            description = 'A system moderator.  This user type moderators content produced by users.',
            name = 'moderator',
        )
        DBSession.add(usertype_mod)
        usertype_sub = UserTypes(
            description = 'A system subscriber.  This user type uses content produced by moderators and users.',
            name = 'subscriber',
        )
        DBSession.add(usertype_sub)
        usertype_user = UserTypes(
            description = 'A basic user.  Accesses the system via mobile app or webpage.',
            name = 'user',
        )
        DBSession.add(usertype_user)

        #
        # Media Types
        #
        mediatype_image = MediaTypes(
            description = 'An Image.',
            name = 'image',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            description = 'An Audio Clip.',
            name = 'audio',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            description = 'A Video.',
            name = 'video',
        )
        DBSession.add(mediatype_image)
        mediatype_image = MediaTypes(
            description = 'Text.',
            name = 'text',
        )
        DBSession.add(mediatype_image)

        # Languages
        language_english = Languages(
            language_code = 'en',
            name = 'English',
        )
        DBSession.add(language_english)
        language_spanish = Languages(
            language_code = 'sp',
            name = 'Spanish',
        )
        DBSession.add(language_spanish)

        transaction.commit()

    with transaction.manager:

        # Users
        usertype = UserTypes.get_from_name(DBSession,'system')
        user_system = Users(
            user_type_id = usertype.user_type_id,
            verified = True,
            client_id = str(uuid.uuid4()),
            first_name = 'SYSTEM USER',
            last_name = 'SYSTEM USER',
            organization = 'Yellr',
            email = '',
            pass_salt = 'salt',
            pass_hash = 'hash', # NOTE: will never be the result of a md5 hash 
        )
        DBSession.add(user_system)

        transaction.commit()

