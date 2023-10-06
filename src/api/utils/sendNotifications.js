const { notifications } = require('../../config/vars')
const Notification = require('../models/notifications.model')

exports.sendNotification = async (socketInstance, notificationData) => {
    let socket = socketInstance
    let { type, notificationTo, adminNotification } = notificationData

    let eventName = getEventName(type)
    if (!eventName)
        return false

    if (!adminNotification)
        eventName = `${eventName}-${notificationTo}`

    socket.emit(eventName, { message: `Event Emitted (${eventName})` })
    await Notification.create(notificationData)
}

const getEventName = (type) => {
    let notificationsTypes = [...notifications]
    let eventName = notificationsTypes.filter((nt) => nt.type === type)[0]?.name

    if (eventName)
        return eventName

    return false
}
