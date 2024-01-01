FROM python:3.9.16-slim-bullseye

WORKDIR /usr/src/app

# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;
    
# Fix certificate issues
RUN apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn
RUN apt

COPY __init__.py ./
COPY app.py ./
COPY config.py ./
COPY database.py ./
COPY models.py ./
COPY secrets.py ./
COPY utilities.py ./

CMD ["gunicorn", "app:app", "-b", "0.0.0.0:8000", "--workers=2", "--threads=4", "--worker-class=gthread", "--worker-tmp-dir", "/dev/shm"]
