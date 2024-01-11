import React, { Component } from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AllDoctors from "./AllDoctors";
import Chatpage from "./Chatpage";
import PdfViewer from "./PdfViewer";

const ChattingStack = () => {
  const Chat = createStackNavigator();
  return (
    <Chat.Navigator>
      <Chat.Screen
        name="allDoctor"
        component={AllDoctors}
        options={{ headerShown: false }}
      />
      <Chat.Screen
        name="chat"
        component={Chatpage}
        options={{ headerShown: false }}
      />
      <Chat.Screen
        name="pdfView"
        component={PdfViewer}
        options={{headerShown:false}}
      />
    </Chat.Navigator>
  );
};

export default ChattingStack;
