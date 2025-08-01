'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Database, Users, FileText, RefreshCw } from 'lucide-react';

interface ConnectionStatus {
  database: boolean;
  authors: boolean;
  articles: boolean;
  error?: string;
}

interface TestResult {
  authors: {
    count: number;
  };
  articles: {
    count: number;
  };
}

export default function TestConnectionPage() {
  const [status, setStatus] = useState<ConnectionStatus>({
    database: false,
    authors: false,
    articles: false
  });
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus({
      database: false,
      authors: false,
      articles: false
    });
    setTestResult(null);

    try {
      // Test database connection
      const dbResponse = await fetch('/api/test-connection');
      const dbData = await dbResponse.json();
      
      if (dbResponse.ok) {
        setStatus(prev => ({ ...prev, database: true }));
        setTestResult({
          authors: dbData.authors,
          articles: dbData.articles
        });
        
        // Test authors collection
        try {
          const authorsResponse = await fetch('/api/authors');
          if (authorsResponse.ok) {
            setStatus(prev => ({ ...prev, authors: true }));
          }
        } catch (error) {
          console.error('Authors test failed:', error);
        }

        // Test articles collection
        try {
          const articlesResponse = await fetch('/api/articles');
          if (articlesResponse.ok) {
            setStatus(prev => ({ ...prev, articles: true }));
          }
        } catch (error) {
          console.error('Articles test failed:', error);
        }
      } else {
        setStatus(prev => ({ 
          ...prev, 
          database: false, 
          error: dbData.error || 'Database connection failed' 
        }));
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        database: false, 
        error: error instanceof Error ? error.message : 'Connection test failed' 
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = (isConnected: boolean) => {
    return isConnected ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusBadge = (isConnected: boolean) => {
    return isConnected ? (
      <Badge variant="default" className="bg-green-500">
        Connected
      </Badge>
    ) : (
      <Badge variant="destructive">
        Disconnected
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Test Database Connection</h1>
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Test Again
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Database Connection */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database Connection
            </CardTitle>
            {getStatusIcon(status.database)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                MongoDB
              </span>
              {getStatusBadge(status.database)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Connection to MongoDB database
            </p>
          </CardContent>
        </Card>

        {/* Authors Collection */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Authors Collection
            </CardTitle>
            {getStatusIcon(status.authors)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {testResult?.authors.count || 0}
              </span>
              {getStatusBadge(status.authors)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Authors in database
            </p>
          </CardContent>
        </Card>

        {/* Articles Collection */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Articles Collection
            </CardTitle>
            {getStatusIcon(status.articles)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {testResult?.articles.count || 0}
              </span>
              {getStatusBadge(status.articles)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Articles in database
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {status.error && (
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{status.error}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p><strong>Possible solutions:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Check if MongoDB is running</li>
                <li>Verify MONGODB_URI in .env.local</li>
                <li>Ensure database exists</li>
                <li>Check network connectivity</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}



      {/* Connection Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Connection Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Database Connection:</span>
              {getStatusBadge(status.database)}
            </div>
            <div className="flex items-center justify-between">
              <span>Authors API:</span>
              {getStatusBadge(status.authors)}
            </div>
            <div className="flex items-center justify-between">
              <span>Articles API:</span>
              {getStatusBadge(status.articles)}
            </div>
          </div>
          
          {status.database && status.authors && status.articles && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ All connections successful! Your MongoDB backend is working properly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 