$tenantId = "<tenantID>"
$subscriptionId = "<subscriptionID>"
$resourceGroupName='<resourceGroupName>'
$functionName = '<functionsName>'
$cosmosDBaccountName='<cosmosDBaccountName>'
$readOnlyRoleDefinitionId = '00000000-0000-0000-0000-000000000002' # as fetched above
# For Service Principals make sure to use the Object ID as found in the Enterprise applications section of the Azure Active Directory portal blade.
$principalId = '<managedID of Functions>'
az login --tenant $tenantId

az account set --subscription $subscriptionId

az cosmosdb sql role assignment create --account-name $cosmosDBaccountName --resource-group $resourceGroupName --scope "/" --principal-id $principalId --role-definition-id $readOnlyRoleDefinitionId

$AZURE_OPENAI_API_KEY="<AZURE_OPENAI_API_KEY>"
$AZURE_OPENAI_API_INSTANCE_NAME="<AZURE_OPENAI_API_INSTANCE_NAME>"
$AZURE_OPENAI_API_DEPLOYMENT_NAME="<AZURE_OPENAI_API_DEPLOYMENT_NAME>"
$AZURE_OPENAI_API_VERSION="2023-05-15"
$GPT_SYSTEM_SETTING="<GPT_SYSTEM_SETTING>"
$COSMOS_DATABASE_NAME="<COSMOS_DATABASE_NAME>"
$COSMOS_COLLECTIONS_NAME="<COSMOS_COLLECTIONS_NAME>"
$BING_API_KEY="<BING_API_KEY>"

az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings AZURE_OPENAI_API_KEY=$AZURE_OPENAI_API_KEY
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings AZURE_OPENAI_API_INSTANCE_NAME=$AZURE_OPENAI_API_INSTANCE_NAME
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings AZURE_OPENAI_API_DEPLOYMENT_NAME=$AZURE_OPENAI_API_DEPLOYMENT_NAME
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings AZURE_OPENAI_API_VERSION=$AZURE_OPENAI_API_VERSION
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings GPT_SYSTEM_SETTING=$GPT_SYSTEM_SETTING
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings COSMOS_DATABASE_NAME=$COSMOS_DATABASE_NAME
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings COSMOS_COLLECTIONS_NAME=$COSMOS_COLLECTIONS_NAME
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings BING_API_KEY=$BING_API_KEY
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings BING_API_KEY=$AzureWebJobsFeatureFlags
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings SCM_DO_BUILD_DURING_DEPLOYMENT=$true
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings COSMOS_DATABASE_NAME=$COSMOS_DATABASE_NAME
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings COSMOS_COLLECTIONS_NAME=$COSMOS_COLLECTIONS_NAME
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings cosmosDB__accountEndpoint="https://pwylkxjc624ug-cosmos-nosql.documents.azure.com:443/"
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings cosmosDB__credential="managedidentity"
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings AzureWebJobsFeatureFlags="EnableWorkerIndexing"
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings WEBSITE_RUN_FROM_PACKAGE="1"

#$jsfiles = Get-ChildItem -Path ./* -Include .\src, .\host.json, .\.funcignore, .\package.json -Verbose

#$excludeItems = @()
#$f = (Get-Content ".\.funcignore") -as [string[]]
#foreach ($l in $f) {
#    $excludeItems += ${l}
#}
#$excludeItems = $excludeItems.trim()
#$jsfiles = Get-ChildItem -Path .\*  -Exclude $excludeItems
#Compress-Archive -Path $jsfiles ..\openai-to-cosmos-langchain-if.zip -Force
#7z.exe a ..\openai-to-cosmos-langchain-if.zip  "${excludeItems}"
#$jsfiles = Get-ChildItem -Path * -Exclude _*, .vscode, .yarn, .*, *ps1, local*, package-lock.json, README*, *http, yarn-error.log, yarn.lock

#Compress-Archive -Path $jsfiles ..\openai-to-cosmos-langchain-if.zip -Force

#az functionapp deployment source config-zip --resource-group $resourceGroupName --name $functionName --src ..\openai-to-cosmos-langchain-if.zip --build-remote true --verbose
func azure functionapp publish $functionName