import { Link, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { ToolPage } from '../components/ToolPage'
import { Button } from '../components/ui'
import { pageTitle } from '../lib/site'
import { getTool } from '../registry/tools'

export function ToolRoutePage() {
  const { slug } = useParams()
  const tool = slug ? getTool(slug) : undefined
  if (!tool) {
    return <NotFoundPage />
  }
  return <ToolPage tool={tool} />
}

export function NotFoundPage() {
  return (
    <>
      <Seo title={pageTitle('Page not found')} description="That page does not exist on Locally." path="/404" />
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-sm font-semibold tracking-widest text-violet-700 uppercase">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-white">Page not found</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">The link may be wrong, or the tool was renamed.</p>
        <Link to="/tools" className="mt-6 inline-block">
          <Button>Back to tools</Button>
        </Link>
      </div>
    </>
  )
}
