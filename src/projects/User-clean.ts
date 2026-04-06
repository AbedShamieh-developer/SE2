interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

class NotificationManagement {
   constructor(private notificationType: INotify){}
   notification(user:User,message: string){
    this.notificationType.notify(user,message)
   }
}
interface INotify{
    notify(user:User,message: string): void
}
class sendEmail implements INotify{
    notify(user: User, message: string): void {
        console.log(`Sending an email to ${user.email}: message: ${message}`)
    }
}
class sendSMS implements INotify{
    notify(user: User, message: string): void {
        console.log(`Sending an sms to ${user.email}: message: ${message}`)
    }
}
class sendPush implements INotify{
    notify(user: User, message: string): void {
        console.log(`Sending a push to ${user.email}: message: ${message}`)
    }
}
const demoUser: User = {id: 1,name:"Abed",email:"efrg",phone:"123"}
const n = new NotificationManagement(new sendEmail())
n.notification(demoUser,"ahshfr")
