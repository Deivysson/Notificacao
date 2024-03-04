import React from 'react';
import { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Button } from 'react-native';

import notifee, { AuthorizationStatus, EventType, AndroidImportance } from '@notifee/react-native'

export default function App(){

  const [statusNotification, setStatusNotification] = useState(true);

  //Aparecer o pop-up, pedir permissao para mandar notificação
  useEffect(() => {
    async function getPermission(){
      const settings = await notifee.requestPermission();
      if(settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED){
        console.log("Permission: ", settings.authorizationStatus)
        setStatusNotification(true);
      }else{
        console.log("Usuario negou a permissão!")
        setStatusNotification(false);
      }
    }

    getPermission();

  }, [])

  //aparecer a notificação na tela quando esta dentro do app
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail}) => {
      switch(type){
        case EventType.DISMISSED:
          console.log("Usuario descartou a notificação")
          break;
        case EventType.PRESS:
          console.log("Tocou: ", detail.notification)  
      }
    })
  }, [])

//disparar uma notificação
  async function handleNotificate(){
    if(!statusNotification){
      return;
    }

    const channelId = await notifee.createChannel({
      id: 'lembrete',
      name: 'lembrete',
      vibration: true,
      importance: AndroidImportance.HIGH
    })

    await notifee.displayNotification({
      id: 'lembrete',
      title: 'Estudar Programação',
      body: 'Estudar React Native',
      android: {
        channelId,
        pressAction:{
          id: 'default'
        }
      }
    })
  }


  return(
    <View style={styles.container}>
      <Text>App</Text>
      <Button 
      title="Enviar notificação"
      onPress={handleNotificate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
