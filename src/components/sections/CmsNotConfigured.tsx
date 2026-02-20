import { AlertCircle, Settings } from 'lucide-react';

export function CmsNotConfigured() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-heading font-bold mb-4">CMS Not Connected</h1>
        <p className="text-muted mb-6">
          This website needs to be connected to your CMS to display content.
        </p>
        <div className="bg-background border rounded-lg p-4 text-left">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            Quick Setup
          </h2>
          <ol className="text-sm text-muted space-y-2 list-decimal list-inside">
            <li>Copy <code className="bg-surface px-1 rounded">.env.example</code> to <code className="bg-surface px-1 rounded">.env.local</code></li>
            <li>Add your <code className="bg-surface px-1 rounded">CONTENT_API_KEY</code></li>
            <li>Restart the development server</li>
          </ol>
        </div>
        <p className="text-xs text-muted mt-6">
          Once configured, this page will display your homepage content.
        </p>
      </div>
    </div>
  );
}
