FROM node:6.9-slim
MAINTAINER Paul Baptista <pbaptist@uni-bonn.de>

RUN mkdir /nodeApp
WORKDIR /nodeApp

# ---------------- #
#   Installation   #
# ---------------- #

ADD ./application/package.json ./
RUN npm install --production

ADD ./application/ ./

# ----------------- #
#   Configuration   #
# ----------------- #

EXPOSE 80

# ----------- #
#   Cleanup   #
# ----------- #

RUN apt-get autoremove -y && apt-get -y clean && \
		rm -rf /var/lib/apt/lists/*

# -------- #
#   Run!   #
# -------- #

CMD npm start
