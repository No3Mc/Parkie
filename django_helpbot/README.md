Directory Structure:

        DJANGO_HELPBOT (main folder for django helpbot web application) (contains manage.py)
        │   manage.py
        │   README.md
        │
        ├───django_helpbot (main folder for application)
        │       asgi.py
        │       settings.py (contains configuration for django helpbot)
        │       urls.py (contains urls for django helpbot)
        │       wsgi.py
        │       __init__.py
        │
        └───django_helpbot_app (application's main folder)
            │   admin.py (contains config for admin of the django helpbot)
            │   apps.py (contains config for django helpbot)
            │   models.py (contains models for django helpbot)
            │   tests.py (to test django helpbot)
            │   views.py (contains configuration for django helpbot)
            │   __init__.py
            │
            └───migrations (to store db migration files)
                    __init__.py (pckg indication for django helpbot)