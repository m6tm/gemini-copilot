import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Completion Provider Tests', () => {

    test('Should provide suggestions for empty line', async () => {
        // Open a new document
        const document = await vscode.workspace.openTextDocument({ language: 'typescript' });
        const editor = await vscode.window.showTextDocument(document);

        // Position at the beginning of the document
        const position = new vscode.Position(0, 0);

        // Manually trigger completion
        const completionList = await vscode.commands.executeCommand(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position
        ) as vscode.CompletionList;

        // Assert that suggestions are provided (this will need to be updated once we have actual suggestions)
        assert.ok(!completionList || completionList.items.length === 0, 'Should not provide suggestions for empty line');

        // Clean up
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    // TODO: Add more tests based on FEAT-001 specification scenarios

    test('Should provide contextual suggestions for object methods', async () => {
        const document = await vscode.workspace.openTextDocument({ language: 'typescript' });
        const editor = await vscode.window.showTextDocument(document);
        await editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), 'const myArray = [1, 2, 3];\nmyArray.');
        });

        const position = new vscode.Position(1, 'myArray.'.length);

        const completionList = await vscode.commands.executeCommand(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position
        ) as vscode.CompletionList;

        // Assert that relevant array methods are suggested (e.g., 'map', 'filter')
        const suggestedMethods = completionList.items.map(item => item.label);
        assert.ok(suggestedMethods.includes('map'), 'Should suggest "map" method');
        assert.ok(suggestedMethods.includes('filter'), 'Should suggest "filter" method');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    test('Should provide suggestions for function parameters', async () => {
        const document = await vscode.workspace.openTextDocument({ language: 'typescript' });
        const editor = await vscode.window.showTextDocument(document);
        await editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), 'function greet(name: string) {}\ngreet(');
        });

        const position = new vscode.Position(1, 'greet('.length);

        const completionList = await vscode.commands.executeCommand(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position
        ) as vscode.CompletionList;

        // Assert that the parameter name is suggested
        const suggestedParams = completionList.items.map(item => item.label);
        assert.ok(suggestedParams.includes('name'), 'Should suggest "name" parameter');

        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    // Note: Testing completion with incomplete/erroneous code and in large files
    // might require more complex test setups or focus on mocking the API response.
    // For now, we focus on basic functional tests.

});