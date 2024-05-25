import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@renderer/assets/update-loading.css'
import logoImage from '@renderer/assets/electron.svg'
import useSWR from 'swr'

const UpdateLoadingPage = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'renderer.updateLoading',
  })

  const [percent, setPercent] = useState(0)
  const [text, setText] = useState(t('loading'))

  const { data: status, mutate } = useSWR('update-status', window.electron.getUpdateStatus)

  useEffect(() => {
    window.electron.onChangeUpdateStatus(status => {
      mutate(status, {
        revalidate: false,
      })
    })
  }, [])

  useEffect(() => {
    if (!status) return

    switch (status.event) {
      case 'download-progress': {
        if (percent !== 100) setPercent(Number(status.data.percent))
        break
      }

      case 'update-downloaded': {
        setText(t('autoRestart'))
        break
      }
    }
  }, [status])

  return (
    <div className="update-loading-window">
      <img src={logoImage} alt="logo" />
      <div className="text">{text}</div>
      <progress value={20} max={100} />
    </div>
  )
}

export default UpdateLoadingPage
