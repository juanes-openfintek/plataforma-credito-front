'use client'
import { useEffect, useState } from 'react'
import BreadcrumbLabel from '../../components/atoms/BreadcrumbLabel/BreadcrumbLabel'
import NotificationBlock from '../../components/molecules/NotificationBlock/NotificationBlock'
import getNotificationsByUser from '../../services/getNotificationsByUser'
import { Notification } from '../../interfaces/notification.interface'
import Paginator from '../../components/molecules/Paginator/Paginator'

const NotificationsPage = () => {
  /**
   * This constant is used to set the number of notifications that will be displayed on the page
   */
  const perPage = 10
  /**
   * This state is used to store all the notifications that the user has
   */
  const [allNotifications, setAllNotifications] = useState<Notification[]>([])
  /**
   * This state is used to store the notifications that will be displayed on the page
   */
  const [notifications, setNotifications] = useState<Notification[]>([])
  /**
   * This function is used to fill the spaces of the notifications array
   */
  const fillSpaces = async (notifications: Notification[]) => {
    const tempNotifications = [...notifications]
    while (tempNotifications.length < perPage) {
      tempNotifications.push({
        title: '',
        _id: '',
        user: '',
        credit: null,
        date: '',
        message: '',
        read: false,
        __v: 0,
      })
      setAllNotifications(tempNotifications)
    }
  }
  /**
   * This function is used to get the notifications from the API
   */
  useEffect(() => {
    const requestNotifications = async () => {
      const notifications: Notification[] = await getNotificationsByUser()
      if (notifications.length < perPage) {
        fillSpaces(notifications)
        return
      }
      setAllNotifications(notifications)
    }
    requestNotifications()
  }, [])

  /**
   * This function is used to change the page of the notifications array
   * @param page This parameter is used to change the page of the notifications array
   */
  const changePage = (page: number) => {
    const tempNotifications: Notification[] = []
    for (let i = (page - 1) * perPage; i < page * perPage; i++) {
      tempNotifications.push(allNotifications[i])
    }
    setNotifications(tempNotifications)
  }

  /**
   * This function is used to change the page when the allNotifications array changes
   */
  useEffect(() => {
    changePage(1)
  }, [allNotifications])

  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <BreadcrumbLabel text='Notificaciones' />
        <h2 className='text-[1.5625rem] font-bold mt-20'>
          Aquí podrás visualizar todas las notificaciones pendientes
        </h2>
        <div className='flex flex-col bg-light-color-one rounded-2xl px-4 py-8 mt-12'>
          <h3 className='pl-4 pr-10 py-2 border-b-[1px] border-black font-bold text-[1.125rem]'>
            Notificación
          </h3>
          {notifications.map((notification, index) => (
            <NotificationBlock
              key={index}
              title={notification?.title}
              read={notification?.read}
            />
          ))}
        </div>
        <Paginator
          total={allNotifications.length}
          perPage={perPage}
          page={1}
          onChange={(page) => changePage(page)}
        />
      </section>
    </main>
  )
}

export default NotificationsPage
