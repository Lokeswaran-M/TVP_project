import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AnimatedTextInput = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 12,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -6],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 14],
    }),
    color: '#aaa',
    backgroundColor: '#fff', // To hide the overlap of text with border
    paddingHorizontal: 5, // Adds padding to the background to make it smooth
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, isFocused && styles.focusedBorder]}>
        <Animated.Text style={labelStyle}>
          {placeholder}
        </Animated.Text>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
        />
        <MaterialCommunityIcons name="account" size={24} color="gray" style={styles.iconStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 15,
  },
  focusedBorder: {
    borderColor: '#ffa500', // Change border color on focus (optional)
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
  },
  iconStyle: {
    marginLeft: 10,
  },
});

export default AnimatedTextInput;





    
    // <ScrollView>
    //   <View style={styles.container}>
    //   {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
    //     <CustomInput
    //       placeholder="Username"
    //       iconName="account"
    //       value={username}
    //       onChangeText={setUsername}
    //     />
    //     {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
    //     <CustomInput
    //       placeholder="Password"
    //       iconName="lock"
    //       value={password}
    //       onChangeText={setPassword}
    //       secureTextEntry
    //     />

    // {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

    //     <CustomInput
    //       placeholder="Confirm Password"
    //       iconName="lock"
    //       value={confirmPassword}
    //       onChangeText={setConfirmPassword}
    //       secureTextEntry
    //     />

    //   {mobileNoError ? <Text style={styles.errorText}>{mobileNoError}</Text> : null}

    //     <CustomInput
    //       placeholder="Mobile No"
    //       iconName="phone"
    //       value={mobileNo}
    //       onChangeText={setMobileNo}
    //     />
    //    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

    //     <CustomInput
    //       placeholder="Email"
    //       iconName="email"
    //       value={email}
    //       onChangeText={setEmail}
    //     />
    //    {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}


    //     <CustomInput
    //       placeholder="Address"
    //       iconName="home"
    //       value={address}
    //       onChangeText={setAddress}
    //     />
    //  {businessNameError ? <Text style={styles.errorText}>{businessNameError}</Text> : null}

    //     <CustomInput
    //       placeholder="Business Name"
    //       iconName="briefcase"
    //       value={businessName}
    //       onChangeText={setBusinessName}
    //     />


    //   {selectedProfessionError ? <Text style={styles.errorText}>{selectedProfessionError}</Text> : null}

    //     {/* <Text style={styles.label}>User ID: {userId}</Text> */}

    //     <Text style={styles.label}>Select Profession</Text>
    //     <View style={styles.selectList}>
    //     <Picker borderBottomWidth='1'
    //       selectedValue={selectedProfession}
    //       style={styles.picker}
    //       onValueChange={(itemValue) => setSelectedProfession(itemValue)}
    //     >
    //       {profession.map((profession, index) => (
    //         <Picker.Item key={index} label={profession.ProfessionName} value={profession.ProfessionName} />
    //       ))}
    //     </Picker>
    //     </View>
    //     {selectedLocationError ? <Text style={styles.errorText}>{selectedLocationError}</Text> : null}

    //     <Text style={styles.label}>Select Location</Text>
    //     <View style={styles.selectList}>
    //     <Picker borderBottomWidth='1'
    //       selectedValue={selectedLocation}
    //       style={styles.picker}
    //       onValueChange={(itemValue) => setSelectedLocation(itemValue)}
    //       >
    //       {chapterNo.map((chapterNo, index) => (
    //         <Picker.Item key={index} label={chapterNo.location} value={chapterNo.location} />
    //       ))}
    //     </Picker>
    //     </View>
    //     {selectedSlotError ? <Text style={styles.errorText}>{selectedSlotError}</Text> : null}

    //     <Text style={styles.label}>Select Slot</Text>
    //     <View style={styles.selectList}>
    //        <Picker borderBottomWidth='1'
    //       selectedValue={selectedChapterType}
    //       style={styles.picker}
    //       onValueChange={(itemValue) => setSelectedChapterType(itemValue)}
    //         >
    //       {chapterType.map((type, index) => (
    //         <Picker.Item key={index} label={type.id.toString()} value={type.id} />
    //       ))}
    //        </Picker>
    //     </View>
        
    //       {referredByError ? <Text style={styles.errorText}>{referredByError}</Text> : null}

    //     <CustomInput
    //       placeholder="Referred By"
    //       iconName="account-group"
    //       value={referredBy}
    //       onChangeText={setReferredBy}
    //     />



    //     {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
    //    {/* Start Date */}
    //   <Text style={styles.label}>Start Date</Text>
    //   <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePickerButton}>
    //     <Text style={styles.datePickerText}>{startDate ? startDate : 'Select Start Date'}</Text>
    //   </TouchableOpacity>

    //   {showStartPicker && (
    //     <DateTimePicker
    //       value={startDate ? new Date(startDate) : new Date()}
    //       mode="date"
    //       display="default"
    //       onChange={onChangeStartDate}
    //     />
    //   )}

    //   {/* End Date */}
    //   <Text style={styles.label}>End Date</Text>
    //   <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePickerButton}>
    //     <Text style={styles.datePickerText}>{endDate ? endDate : 'Select End Date'}</Text>
    //   </TouchableOpacity>

    //   {showEndPicker && (
    //     <DateTimePicker
    //       value={endDate ? new Date(endDate) : new Date()}
    //       mode="date"
    //       display="default"
    //       onChange={onChangeEndDate}
    //     />
    //   )}


    //     <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
    //     <Text style={styles.registerButtonText}>Register</Text>
    //   </TouchableOpacity>
   
    //     {/* <Button title="Register" onPress={handleRegister} /> */}
    //   </View>
    // </ScrollView>