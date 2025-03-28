import requests
import json
from pymongo import MongoClient
from datetime import datetime
from dataclasses import dataclass
from dateutil import parser

# Config
MONGO_HOST = 'localhost' # TODO: Fill in your MongoDB host
DB_NAME = 'test'         # TODO: Fill in your MongoDB database name
EVENTBRITE_TOKEN= ''     # TODO: Fill in your Eventbrite token

# Connect to MongoDB
client = MongoClient(MONGO_HOST, 27017)
db = client[DB_NAME]
coll = db['users']

total_pages = 1
cur_page = 1

session = requests.Session()
session.headers["Authorization"] = f"Bearer {EVENTBRITE_TOKEN}"

@dataclass
class User:
    email: str
    first_name: str
    last_name: str
    created: datetime
    event_id: str
    isActive = True
    isPaid = True

users: list[User] = []

while cur_page <= total_pages:
    print(f"Page {cur_page} of {total_pages}")
    page = session.get("https://www.eventbriteapi.com/v3/events/738844412527/attendees")
    data = page.json()
    total_pages = data["pagination"]["page_count"]
    cur_page += 1

    for attendee in data["attendees"]:
        profile = attendee["profile"]
        user = User(event_id=attendee["event_id"], created=parser.parse(attendee["created"]), email=profile["email"], first_name=profile["first_name"], last_name=profile["last_name"])
        users.append(user)


email_set = set()
users_to_insert = []
for user in users:
    if user.email not in email_set:
        email_set.add(user.email)
        users_to_insert.append(user)
        continue

coll.insert_many([user.__dict__ for user in users_to_insert])
