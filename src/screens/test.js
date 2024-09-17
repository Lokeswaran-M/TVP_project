import React, { useState, useEffect } from 'react';
import { View, Picker, Text } from 'react-native';

const CascadingDropdowns = () => {
  const [professions, setProfessions] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState(null);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);


  // const [profession, setProfession] = useState([]); 
  // const [selectedProfession, setSelectedProfession] = useState('');

  // const [chapterType, setChapterType] = useState([]); 
  // const [selectedChapterType, setSelectedChapterType] = useState('');

  // const [LocationID, setLocationID] = useState([]); 
  // const [selectedLocation, setSelectedLocation] = useState('');



  // Fetch initial profession list from API
  useEffect(() => {
    fetch('https://api.example.com/professions') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((data) => setProfessions(data))
      .catch((error) => console.error(error));
  }, []);

  // Fetch locations based on selected profession
  useEffect(() => {
    if (selectedProfession) {
      fetch(`https://api.example.com/locations?profession=${selectedProfession}`)
        .then((response) => response.json())
        .then((data) => setLocations(data))
        .catch((error) => console.error(error));

      // Reset location and slot when profession changes
      setSelectedLocation(null);
      setSlots([]); // Reset slots
    }
  }, [selectedProfession]);

  // Fetch slots based on both selected profession and location
  useEffect(() => {
    if (selectedProfession && selectedLocation) {
      fetch(`https://api.example.com/slots?profession=${selectedProfession}&location=${selectedLocation}`)
        .then((response) => response.json())
        .then((data) => setSlots(data))
        .catch((error) => console.error(error));

      // Reset slot when location changes
      setSelectedSlot(null);
    }
  }, [selectedProfession, selectedLocation]);

  return (
    <View>
      {/* Profession Dropdown */}
      <Text>Select Profession</Text>
      <Picker
        selectedValue={selectedProfession}
        onValueChange={(value) => setSelectedProfession(value)}
      >
        <Picker.Item label="Select Profession" value={null} />
        {professions.map((profession) => (
          <Picker.Item key={profession.id} label={profession.name} value={profession.id} />
        ))}
      </Picker>

      {/* Location Dropdown */}
      <Text>Select Location</Text>
      <Picker
        selectedValue={selectedLocation}
        enabled={!!selectedProfession}  // Enable only if profession is selected
        onValueChange={(value) => setSelectedLocation(value)}
      >
        <Picker.Item label="Select Location" value={null} />
        {locations.map((location) => (
          <Picker.Item key={location.id} label={location.name} value={location.id} />
        ))}
      </Picker>

      {/* Slot Dropdown */}
      <Text>Select Slot</Text>
      <Picker
        selectedValue={selectedSlot}
        enabled={!!selectedLocation && !!selectedProfession}  // Enable only if both profession and location are selected
        onValueChange={(value) => setSelectedSlot(value)}
      >
        <Picker.Item label="Select Slot" value={null} />
        {slots.map((slot) => (
          <Picker.Item key={slot.id} label={slot.time} value={slot.id} />
        ))}
      </Picker>
    </View>
  );
};

export default CascadingDropdowns;
