import { useState, useRef } from 'react'
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
  width: 100%;
  padding: 0 32px;
  gap: 32px;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.06);
  flex: 1;
  padding: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 10px 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const HeaderTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #23272f;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  &:hover {
    background: #f0f0f0;
  }
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

function CopyIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#23272f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
  );
}

function ClearIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#ff4d4f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 10v6M15 10v6M10 4h4"/></svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="#2d7a46" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v12M6 13l6 6 6-6"/><rect x="4" y="19" width="16" height="2" rx="1"/></svg>
  );
}

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
  const editorRef = useRef<any>(null)

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

  const handleEditorCopy = () => {
    navigator.clipboard.writeText(jsonValue)
  }

  const handleEditorClear = () => {
    setJsonValue('')
    setParsedJson(null)
    setJsonError(null)
  }

  const handleViewerCopy = () => {
    if (!jsonError && parsedJson) {
      navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2))
    }
  }

  const handleViewerClear = () => {
    setJsonValue('')
    setParsedJson(null)
    setJsonError(null)
  }

  const handleViewerDownload = () => {
    if (!jsonError && parsedJson) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parsedJson, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "formatted.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  }

  return (
    <PageContainer>
      <Title>JSON Viewer / Editor</Title>
      <AppContainer>
        <Card>
          <Header>
            <HeaderTitle>Editor</HeaderTitle>
            <HeaderActions>
              <IconButton title="Copy" onClick={handleEditorCopy}><CopyIcon /></IconButton>
              <IconButton title="Clear" onClick={handleEditorClear}><ClearIcon /></IconButton>
            </HeaderActions>
          </Header>
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
          <Header>
            <HeaderTitle>Viewer</HeaderTitle>
            <HeaderActions>
              <IconButton title="Copy" onClick={handleViewerCopy} disabled={!!jsonError}><CopyIcon /></IconButton>
              <IconButton title="Clear" onClick={handleViewerClear}><ClearIcon /></IconButton>
              <IconButton title="Download" onClick={handleViewerDownload} disabled={!!jsonError}><DownloadIcon /></IconButton>
            </HeaderActions>
          </Header>
          <ViewerWrapper>
            {jsonError ? (
              <ErrorMessage>
                <strong>JSON Error:</strong> {jsonError}
              </ErrorMessage>
            ) : (
              jsonValue.trim() && parsedJson ? (
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
              ) : (
                <div style={{ color: '#bbb', fontStyle: 'italic', marginTop: 24 }}>No JSON to display</div>
              )
            )}
          </ViewerWrapper>
        </Card>
      </AppContainer>
    </PageContainer>
  )
}

export default App
