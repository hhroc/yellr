import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.txt')) as f:
    README = f.read()
with open(os.path.join(here, 'CHANGES.txt')) as f:
    CHANGES = f.read()

requires = [
    'mutagen',
    'pyramid',
    'pyramid_chameleon',
    'pyramid_debugtoolbar',
    'pyramid_tm',
    'python-magic',
    'SQLAlchemy',
    'transaction',
    'zope.sqlalchemy',
    'waitress',
    'mysql-python',
    ]

setup(name='yellr-serv',
      version='0.0',
      description='yellr-serv',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        ],
      author='',
      author_email='',
      url='',
      keywords='web wsgi bfg pylons pyramid',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      test_suite='yellrserv',
      install_requires=requires,
      entry_points="""\
      [paste.app_factory]
      main = yellrserv:main
      [console_scripts]
      initialize_yellr-serv_db = yellrserv.scripts.initializedb:main
      """,
      )
