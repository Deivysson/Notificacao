import React from 'react';
import { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Button } from 'react-native';

import notifee, { AuthorizationStatus, EventType, AndroidImportance, TriggerType, TimestampTrigger } from '@notifee/react-native'

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

  //agendar uma notificação
  async function handleScheduleNotification(){
    const date = new Date(Date.now());

    date.setMinutes(date.getMinutes() + 1);
    // Se usa TimestampTrigger so se tiver usando Typescript
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime()
    }

    await notifee.createTriggerNotification({
      title: "Lembrete Estudo",
      body: 'Estudar JS as 15h30',
      android: {
        channelId: 'lembrete',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        }
      }
    }, trigger)

  }


  return(
    <View style={styles.container}>
      <Text>App</Text>
      <Button 
      title="Enviar notificação"
      onPress={handleNotificate}
      />

      <Button 
      title='Agendar Notificação'
      onPress={handleScheduleNotification}
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
