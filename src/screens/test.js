const handleLogin = async () => {
  if (username === '' || password === '') {
    alert('Please enter both username and password');
    return;
  }

  try {
    const response = await fetch('http://your-backend-url/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      // Handle successful login (e.g., navigate to another screen, save user data)
      console.log('Login successful:', result);
      navigation.navigate('DrawerNavigator');
    } else {
      // Handle login failure (e.g., show error message)
      alert(result.error || 'Login failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
    console.error(error);
  }
};
