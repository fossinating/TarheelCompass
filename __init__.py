import os

from flask import Flask

from flask import Flask, render_template_string, render_template, redirect, flash, request, Response
from flask_mail import Mail
from flask_security import Security, current_user, auth_required, \
    SQLAlchemySessionUserDatastore, login_required
from flask_wtf import CSRFProtect
import config
from database import db_session
from models import User, Role

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config.from_object(config)
mail = Mail(app)

# Generate a nice key using secrets.token_urlsafe()
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
# Bcrypt is set as default SECURITY_PASSWORD_HASH, which requires a salt
# Generate a good salt using: secrets.SystemRandom().getrandbits(128)
app.config['SECURITY_PASSWORD_SALT'] = os.environ.get("SECURITY_PASSWORD_SALT",
                                                      '146585145368132386173505678016728509634')

# Setup Flask-Security
user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
security = Security(app, user_datastore)
