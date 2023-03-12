import json
import csv

# Load the JSON data
with open('Core/routes/CustDev/users.json') as json_file:
    data = json.load(json_file)

# Open the output CSV file in write mode
with open('users.csv', mode='w', newline='') as csv_file:
    writer = csv.writer(csv_file)

    # Write the CSV header
    writer.writerow(['storedUsername', 'storedPassword'])

    # Write each user as a CSV row
    for user in data['users']:
        writer.writerow([user['storedUsername'], user['storedPassword']])
