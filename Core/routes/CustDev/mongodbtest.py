import bcrypt
password = "No3Mc lejhund ov thi warald".encode('utf-8')
hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

print(hashed_password)

