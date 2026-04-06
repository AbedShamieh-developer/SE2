interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

// Messy, not SOLID
class NotificationManager {
    sendEmail(user: User, message: string){
        console.log(`Sending email to ${user.email}: ${message}`)
    }

    sendSMS(user: User, message: string){
        console.log(`Sending SMS to ${user.phone}: ${message}`)
    }

    sendPush(user: User, message: string){
        console.log(`Sending Push to ${user.name}: ${message}`)
    }

    notify(user: User, message: string, method: string){
        if(method === "email") this.sendEmail(user, message)
        else if(method === "sms") this.sendSMS(user, message)
        else if(method === "push") this.sendPush(user, message)
        else console.log("Unknown method")
    }
}

// --- Usage
const user: User = {id: 1, name: "Ali", email: "ali@test.com", phone: "12345"}
const manager = new NotificationManager()
manager.notify(user, "Hello!", "email")
manager.notify(user, "Hi!", "sms")
manager.notify(user, "Hey!", "push")