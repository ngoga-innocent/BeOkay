import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS, width } from "./Colors";

const DateTime = ({ mode,onTimeChange }) => {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [date,setDate]=useState(new Date())
  const showTimePicker = () => {
    setTimePickerVisible(!isTimePickerVisible);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeChange = (event, time) => {
    if (time) {
      const currentTime = time || date
      setDate(currentTime)
      const tempDate=new Date(currentTime)
      // console.log(tempDate)
      setSelectedTime(tempDate.toLocaleTimeString());
      const fomratetime = time.toLocaleTimeString('en-US', {hour12: false});
      onTimeChange(fomratetime)
      // console.log(time.toLocaleTimeString())
    }
    hideTimePicker();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity className="px-3 rounded-md bg-gray-200 py-1" onPress={showTimePicker}>
        <Text>{selectedTime || "-- : -- : --"}</Text>
      </TouchableOpacity>
      {isTimePickerVisible && (
        <DateTimePicker
          value={date}
          mode={mode}
          display="spinner"
          onChange={handleTimeChange}
          style={{ width: width / 3 }}
        />
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  inputField: {
    padding: 2,
    paddingLeft: 2,

    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 2,
    backgroundColor: COLORS.backgrounds,
  },
};
export default DateTime;
