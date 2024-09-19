function DrawerNavigator() {
  const dispatch = useDispatch();
  dispatch(setUser(result));
  const { rollId } = result.user; 
  console.log('rollId====================', result.user);
  console.log('rollId====================', rollId);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />} 
      screenOptions={{
        drawerActiveTintColor: '#a3238f', 
        drawerInactiveTintColor: 'black', 
        drawerStyle: {
          backgroundColor: 'white', 
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
          ...HeaderWithImage(),
        }} 
      />
      <Drawer.Screen 
        name="Profile screen" 
        component={ProfileStackNavigator}
        options={({ navigation }) => ({
          drawerLabel: 'View Profile',
          drawerIcon: ({ color, size }) => (
            <Icon name="user-circle" color={color} size={size} />
          ),
          headerShown: false,
          ...HeaderWithoutImage({ navigation }),
        })} 
      />

      {rollId === 2 && (
        <>
          <Drawer.Screen
            name="Creatingmeeting"
            component={Creatingmeeting}
            options={({ navigation }) => ({
              drawerLabel: 'Creatingmeeting',
              drawerIcon: ({ color, size }) => (
                <Icon name="ticket" color={color} size={size} />
              ),
              ...HeaderWithoutImage({ navigation }),
            })}
          />

          <Drawer.Screen
            name="CreateQR"
            component={CreateQR}
            options={({ navigation }) => ({
              drawerLabel: 'CreateQR',
              drawerIcon: ({ color, size }) => (
                <Icon name="ticket" color={color} size={size} />
              ),
              ...HeaderWithoutImage({ navigation }),
            })}
          />

          <Drawer.Screen
            name="Attendance"
            component={Attendance}
            options={({ navigation }) => ({
              drawerLabel: 'Attendance',
              drawerIcon: ({ color, size }) => (
                <Icon name="ticket" color={color} size={size} />
              ),
              ...HeaderWithoutImage({ navigation }),
            })}
          />
        </>
      )}

      <Drawer.Screen
        name="Substitute Login"
        component={SubstituteLogin}
        options={({ navigation }) => ({
          drawerLabel: 'Substitute Login',
          drawerIcon: ({ color, size }) => (
            <Icon name="user-plus" color={color} size={size} />
          ),
          header: () => (
            <View style={styles.topNav}>
              <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="navicon" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonNavtop}>
                <View style={styles.topNavlogo}>
                  <Icon name="user" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.NavbuttonText}>SUBSTITUTE LOGIN</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />

      <Drawer.Screen
        name="Payment"
        component={Payment}
        options={({ navigation }) => ({
          drawerLabel: 'Payment',
          drawerIcon: ({ color, size }) => (
            <Icon name="money" color={color} size={size} />
          ),
          ...HeaderWithoutImage({ navigation }),
        })}
      />

      <Drawer.Screen
        name="Subscription"
        component={Subscription}
        options={({ navigation }) => ({
          drawerLabel: 'Subscription',
          drawerIcon: ({ color, size }) => (
            <Icon name="ticket" color={color} size={size} />
          ),
          ...HeaderWithoutImage({ navigation }),
        })}
      />

      <Drawer.Screen
        name="Logout"
        component={LoginScreen}
        options={({ navigation }) => ({
          drawerLabel: 'Logout',
          drawerIcon: ({ color, size }) => (
            <Icon name="sign-out" color={color} size={size} />
          ),
          headerShown: false,
        })}
      />
    </Drawer.Navigator>
  );
}
