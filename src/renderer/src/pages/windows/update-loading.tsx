import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/card'
import { Progress } from '@renderer/components/ui/progress'

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
    <div className="flex h-screen w-screen items-center justify-center">
      <style>
        {`
          body {
            background-color: transparent;
          }
        `}
      </style>

      <Card className="w-full max-w-sm shadow-none corner-smoothing-md rounded-3xl">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="bg-primary/5 flex size-12 items-center justify-center rounded-xl p-2.5 corner-smoothing-md">
            <img
              className="size-full"
              src="https://www.electronjs.org/assets/img/logo.svg"
              alt="logo"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-base">Software Update</CardTitle>
            <CardDescription className="text-xs">{text}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <Progress value={percent} className="h-2 [&>div]:rounded-full" />

          <div className="flex justify-end">
            <span className="text-muted-foreground text-xs font-medium tabular-nums">
              {percent.toFixed(0)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdateLoadingPage
