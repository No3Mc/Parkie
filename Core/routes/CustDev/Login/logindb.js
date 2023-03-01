function loginUser(email, password, callback) {
    const query = { email: email, password: password };
  
    users.findOne(query, function(err, user) {
      if (err) {
        console.log('Failed to find user in database');
        return callback(err);
      }
  
      if (!user) {
        console.log('Invalid email or password');
        return callback(null, false);
      }
  
      console.log('Login successful');
      return callback(null, true);
    });
  }
  