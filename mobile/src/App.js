import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Switch, FlatList, PermissionsAndroid, ActivityIndicator, Modal, Alert, TextInput, ScrollView } from 'react-native'
import Feather from "react-native-feather1s"
import { BleManager } from 'react-native-ble-plx'
import base64 from 'react-native-base64'

import styles from './styles'

export default function App() {
  const [isEnable, setIsEnable] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [deviceList, setDeviceList] = useState([])
  const [connectedDevice, setConnectedDevice] = useState({})
  const [isConnected, setIsConnected] = useState(false)

  const [deviceID, setDeviceID] = useState('')
  const [serviceID, setServiceID] = useState('')
  const [characteristicID, setCharacteristicID] = useState('')

  const [sendCommand, setSendCommand] = useState('')
  const [receiveCommand, setReceiveCommand] = useState('')

  const manager = new BleManager

  async function verifyStatus() {
    const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    if (!result) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    }
    const status = await manager.state()
    if (status === 'PoweredOn') setIsEnable(true)
    if (status === 'PoweredOff') setIsEnable(false)
  }

  async function toogleStatus() {
    try {
      if (isEnable) {
        await manager.disable()
        setIsScanning(false)
        setIsEnable(false)
        setIsConnected(false)
      }
      else {
        await manager.enable()
        setIsEnable(true)
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  async function startScanDevices() {
    setIsScanning(true)

    let list = deviceList.slice()

    manager.startDeviceScan(null, null, (err, device) => {
      if (err) return

      const hasID = list.some(elem => elem.id == device.id)

      if (!hasID) {
        list.push(device)
        setDeviceList(list)
      }
    })

  }

  async function stopScanDevices() {
    setIsScanning(false)
    manager.stopDeviceScan()
  }


  async function connect(device) {

    await device.connect()

    setIsConnected(true)

    setDeviceID(device.id)

    await device.discoverAllServicesAndCharacteristics()
    const services = await device.services()

    services.forEach(async (srv) => {
      if (srv.uuid.startsWith('c00fa')) {
        const customService = srv.uuid

        setServiceID(customService)

        console.log(customService)

        const characteristics = await device.characteristicsForService(customService)

        characteristics.forEach(chrt => {
          if (chrt.uuid.startsWith('c00fa')) {
            const customCharacteristic = chrt.uuid

            setCharacteristicID(customCharacteristic)

            console.log(customCharacteristic)

            setConnectedDevice(device)

            setTimeout(() => startMonitoring(), 100)
          }
        })
      }
    });
  }

  async function disconnect() {
    try {
      manager.cancelTransaction('LISTEN')
      const device = connectedDevice
      await device.cancelConnection()
      setIsConnected(false)
    } catch (err) {
      console.log(err)
    }
  }

  function notAvailableAlert() {
    Alert.alert('Aviso :', ('Não foi possível se conectar a esse dispositivo!'))
  }

  async function writeCommand() {
    manager.cancelTransaction('LISTEN')
    const encodedCommand = base64.encode(sendCommand)
    await manager.writeCharacteristicWithoutResponseForDevice(deviceID, serviceID, characteristicID, encodedCommand)
    setTimeout(() => startMonitoring(), 200)
  }

  function startMonitoring() {
    manager.monitorCharacteristicForDevice(deviceID, serviceID, characteristicID, (err, rxSerial) => {
      if (err) {
        console.log(err)
      } else {
        const decodedCommad = base64.decode(rxSerial.value)
        setReceiveCommand(decodedCommad)
      }
    }, 'LISTEN')
  }

  useEffect(() => {
    verifyStatus()
  }, [])

  return (
    <View style={isScanning ? styles.opacityContainer : styles.container}>
      <ScrollView
      showsVerticalScrollIndicator={false}
      >
      <Modal
        visible={isScanning}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size={80}
            color='#FFA707'
            marginBottom={20}
          />
          <TouchableOpacity
            onPress={stopScanDevices}
            style={styles.action}
          >
            <Text style={styles.actionText}>Parar busca</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerText}>Bluetooth</Text>
        <Switch onValueChange={toogleStatus} value={isEnable} />
      </View>

      {!isConnected ? (
        <View>
          <TouchableOpacity
            onPress={startScanDevices}
            disabled={!isEnable}
            style={isEnable ? styles.action : styles.actionDisabled}
          >
            <Text style={styles.actionText}>Buscar dispositivos</Text>
          </TouchableOpacity>



          {isEnable && (
            <View>
              <Text style={styles.title}>Dispositivos encontrados :</Text>
              <FlatList
                data={deviceList}
                keyExtractor={fDevice => String(fDevice.id)}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: fDevice }) => (
                  <TouchableOpacity
                    onPress={fDevice.name ? () => connect(fDevice) : notAvailableAlert}
                    style={styles.actionDevice}
                  >
                    <Feather name="bluetooth" size={22} color='#FFA707' />
                    <Text style={styles.deviceText}>{fDevice.name ? fDevice.name : 'Sem nome'}</Text>
                    <Feather name="link" size={22} color='#FFA707' />
                  </TouchableOpacity>
                )}
              />
            </View>)}


        </View>
      ) : (
          <View>
            <TouchableOpacity
              onPress={disconnect}
              style={styles.action}
            >
              <Text style={styles.actionText}>Desconectar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Dispositivo conectado:</Text>
            <TouchableOpacity
              onPress={disconnect}
              style={styles.actionDevice}
            >
              <Feather name="bluetooth" size={22} color='#FFA707' />
              <Text style={styles.deviceText}>{connectedDevice.name}</Text>
              <Feather name="x-circle" size={22} color='#FFA707' />
            </TouchableOpacity>
            <View style={styles.detailContainer}>
              <Text><Text style={styles.featured}>ID do Serviço : </Text> {serviceID}</Text>
              <Text><Text style={styles.featured}>ID da Característica : </Text> {characteristicID}</Text>
              <Text><Text style={styles.featured}>ID do Dispositivo : </Text> {deviceID}</Text>
            </View>

            <View style={styles.viewFooter}>

              <View style={styles.viewRow}>
                <View style={styles.txtBorded}>
                  <Text>Recebido: {receiveCommand}</Text>
                </View>
              </View>
              <View style={styles.viewRow}>
                <TextInput
                  style={styles.txtInput}
                  placeholder='Digita o comando aqui...'
                  onChangeText={(val) => setSendCommand(val)}
                >
                </TextInput>
                <TouchableOpacity
                  onPress={writeCommand}
                >
                  <Feather name="send" size={30} color='#FFA707' />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}