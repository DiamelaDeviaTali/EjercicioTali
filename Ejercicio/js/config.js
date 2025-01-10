const CONFIG = {
    apiUrl: 'https://susaqrgcnsnzsovimyim.supabase.co/rest/v1/test',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1c2FxcmdjbnNuenNvdmlteWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDk4ODgsImV4cCI6MjA0ODk4NTg4OH0.HrlXcefmq87bNbW3esH2WuTV32Zv_bJioMrMlHphfA8',
    headers: function() {
        return {
            'apikey': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }
};

export default CONFIG;