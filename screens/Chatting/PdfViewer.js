import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import PDFView from 'react-native-view-pdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing'

const DocumentViewer = ({ message }) => {
  const [pdfUri, setPdfUri] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const fileUri = `${FileSystem.cacheDirectory}${message.name}`;
        await FileSystem.copyAsync({ from: message.uri, to: fileUri });
        await FileSystem.downloadAsync(file.uri, fileUri);
        await Sharing.openAsync(fileUri);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [message]);

  return (
    <View style={{ flex: 1 }}>
      {pdfUri ? (
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={pdfUri}
          resourceType="file"
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading PDF...</Text>
        </View>
      )}
    </View>
  );
};

const PdfViewer = ({ route }) => {
  const { file } = route.params;

  return <DocumentViewer message={file} />;
};

export default PdfViewer;
