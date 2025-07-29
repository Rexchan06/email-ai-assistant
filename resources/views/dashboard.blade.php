<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Email AI Assistant - Dashboard</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            .results { margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1>Email AI Assistant Dashboard</h1>
                <p style="margin: 0; color: #666;">Logged in as: {{ auth()->user()->email }}</p>
            </div>
            <form action="{{ route('logout') }}" method="POST" style="margin: 0;">
                @csrf
                <button type="submit" style="background: #dc3545; padding: 8px 16px;">Logout</button>
            </form>
        </div>
        <p>Clean your emails using AI classification</p>
        
        <form action="{{ route('email.process') }}" method="POST">
            @csrf
            
            <div class="form-group">
                <label for="daysOld">Delete emails older than (days):</label>
                <input type="number" name="daysOld" id="daysOld" min="1" max="365" value="30" required>
            </div>
            
            <div class="form-group">
                <label for="category">Email category to delete:</label>
                <select name="category" id="category" required>
                    <option value="">-- Select Category --</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Social">Social</option>
                    <option value="Update">Update</option>
                    <option value="Important">Important</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="confidenceThreshold">Minimum confidence threshold (%):</label>
                <input type="number" name="confidenceThreshold" id="confidenceThreshold" min="50" max="100" value="80" required>
                <small>Emails with confidence above this level will be auto-deleted</small>
            </div>
            
            <button type="submit">Process Emails</button>
        </form>
        
        @if(session('result'))
            <div class="results">
                <h3>Results:</h3>
                <pre>{{ json_encode(session('result'), JSON_PRETTY_PRINT) }}</pre>
            </div>
        @endif
    </body>
</html>