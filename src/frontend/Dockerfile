FROM node
RUN useradd -m myfxtracker
USER myfxtracker
COPY . /frontend
WORKDIR /frontend
RUN npm install && cd calculator && npm link && cd .. && npm link calculator
CMD ["npm", "start"]