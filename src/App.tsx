import { useState } from 'react'
import styled from 'styled-components'
import Editor from '@monaco-editor/react'
import ReactJson from 'react-json-view'

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f7f8fa;
  padding: 40px 0;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #23272f;
  margin-bottom: 32px;
  text-align: center;
  font-family: 'Inter', Arial, sans-serif;
`;

const AppContainer = styled.div`
  display: flex;
  max-width: 1100px;
  margin: 0 auto;
  gap: 32px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  flex: 1;
  padding: 24px 0 24px 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const EditorWrapper = styled.div`
  flex: 1;
  min-height: 400px;
  border-radius: 12px;
  overflow: hidden;
`;

const ViewerWrapper = styled.div`
  flex: 1;
  min-height: 400px;
  border-radius: 12px;
  overflow: auto;
  padding: 0 24px;
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  background: #fff0f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
  margin-top: 24px;
`;

function App() {
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [jsonValue, setJsonValue] = useState<string>(`{
  "string": "example",
  "number": 42,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": {
    "nested": "value",
    "another": 12
  }
}`)
  const [parsedJson, setParsedJson] = useState<any>(() => {
    try {
      return JSON.parse(`{
  "string": "example",
  "number": 42,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3],
  "object": {
    "nested": "value",
    "another": 12
  }
}`)
    } catch {
      return null
    }
  })

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return
    try {
      const parsed = JSON.parse(value)
      setJsonError(null)
      setJsonValue(value)
      setParsedJson(parsed)
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(error.message)
        setParsedJson(null)
      }
    }
  }

  return (
    <PageContainer>
      <Title>JSON Viewer / Editor</Title>
      <AppContainer>
        <Card>
          <EditorWrapper>
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="light"
              value={jsonValue}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                wordWrap: 'on',
                automaticLayout: true,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                roundedSelection: false,
                scrollbar: { vertical: 'auto', horizontal: 'auto' },
              }}
            />
          </EditorWrapper>
        </Card>
        <Card>
          <ViewerWrapper>
            {jsonError ? (
              <ErrorMessage>
                <strong>JSON Error:</strong> {jsonError}
              </ErrorMessage>
            ) : (
              <ReactJson
                src={parsedJson}
                name={false}
                theme="rjv-default"
                iconStyle="triangle"
                displayDataTypes={false}
                enableClipboard={false}
                collapsed={false}
                style={{ background: 'transparent', fontSize: 16 }}
              />
            )}
          </ViewerWrapper>
        </Card>
      </AppContainer>
    </PageContainer>
  )
}

export default App
