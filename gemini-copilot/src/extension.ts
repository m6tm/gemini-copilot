// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gemini-copilot" is now active!');

	// Command to set the API key
	let setApiKeyCommand = vscode.commands.registerCommand('gemini-copilot.setApiKey', async () => {
		const apiKey = await vscode.window.showInputBox({
			prompt: 'Enter your Google Gemini API Key',
			ignoreFocusOut: true,
			password: true
		});

		if (apiKey) {
			await context.secrets.store('geminiApiKey', apiKey);
			vscode.window.showInformationMessage('Gemini API Key stored securely.');
		} else {
			vscode.window.showWarningMessage('Gemini API Key not entered.');
		}
	});
	context.subscriptions.push(setApiKeyCommand);

	// Get the API key from secret storage and initialize the API client
	context.secrets.get('geminiApiKey').then((apiKey: string | undefined) => {
		if (!apiKey) {
			vscode.window.showWarningMessage('Gemini API Key not found. Please set it using the "Set Gemini API Key" command.');
			return;
		}

		const genAI = new GoogleGenerativeAI(apiKey);

		// The command has been defined in the package.json file
		// Now provide the implementation of the command with registerCommand
		// The commandId parameter must match the command field in package.json
		const disposable = vscode.commands.registerCommand('gemini-copilot.helloWorld', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World from Gemini Copilot!');
		});

		context.subscriptions.push(disposable);

		// Register a completion item provider
		const provider = vscode.languages.registerCompletionItemProvider(
			'*', // Register for all languages
			{
				async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
					// Get the text from the current line up to the cursor position
					const linePrefix = document.lineAt(position).text.substr(0, position.character);
					console.log(`Completion requested with line prefix: ${linePrefix}`);

					if (linePrefix.length === 0) {
						return undefined; // No suggestions if the line is empty
					}

					try {
						// For text-only input, use the gemini-pro model
						const model = genAI.getGenerativeModel({ model: "gemini-pro" });

						const result = await model.generateContent(linePrefix);
						const response = await result.response;
						const text = response.text();

						if (!text) {
							return undefined;
						}

						// Split the response into potential completion items
						const suggestions = text.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);

						// Convert suggestions to vscode.CompletionItem
						const completionItems = suggestions.map((suggestion: string) => {
							const item = new vscode.CompletionItem(suggestion, vscode.CompletionItemKind.Text);
							// Optional: Add more details like documentation
							// item.documentation = new vscode.MarkdownString("Gemini Copilot Suggestion");
							return item;
						});

						return completionItems;

					} catch (error) {
						console.error('Error calling Gemini API:', error);
						// Handle errors appropriately, maybe show a message to the user
						return undefined;
					}
				}
			}
		);

		context.subscriptions.push(provider);
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }
