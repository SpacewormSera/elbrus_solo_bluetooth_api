const connectButton = document.getElementById('connectButton');
const disconnectButton =
  document.getElementById('disconnectButton');
const colourPicker = document.getElementById('colourPicker');
const colourButton = document.getElementById('colourButton');
const connect = document.getElementById('connect');
const deviceHeartbeat = document.getElementById('deviceHeartbeat');

const primaryServiceUuid = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const receiveCharUuid = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const sendCharUuid = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

let device, sendCharacteristic, receiveCharacteristic;
connectButton.onclick = async () => {
  device = await navigator.bluetooth
    .requestDevice({
      filters: [{
        services: [primaryServiceUuid]
      }]
    });
  const server = await device.gatt.connect();
  console.log('CONNECTED');

  const service =
    await server.getPrimaryService(primaryServiceUuid);
  receiveCharacteristic =
    await service.getCharacteristic(receiveCharUuid);
  sendCharacteristic =
    await service.getCharacteristic(sendCharUuid);

  device.ongattserverdisconnected = disconnect;
  connected.style.display = 'block';
  connectButton.style.display = 'none';
  disconnectButton.style.display = 'initial';
};


const disconnect = () => {
  device = null;
  receiveCharacteristic = null;
  sendCharacteristic = null;
  connected.style.display = 'none';
  connectButton.style.display = 'initial';
  disconnectButton.style.display = 'none';
};

disconnectButton.onclick = async () => {
  await device.gatt.disconnect();
  disconnect();
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b];
};


colourButton.onclick = async () => {
  const data = new Uint8Array([1, ...hexToRgb(colourPicker.value)]);
  sendCharacteristic.writeValue(data);
};