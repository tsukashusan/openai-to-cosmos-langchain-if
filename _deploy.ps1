$tenantId = "<tenantId>"
$subscriptionId = "<subscriptionId>"
$resourceGroupName='<resourceGroupName>'
$functionName = '<functionName>'
$cosmosDBAccountName='<cosmosDBAccountName>'
$readOnlyRoleDefinitionId = '00000000-0000-0000-0000-000000000002' # as fetched above
# For Service Principals make sure to use the Object ID as found in the Enterprise applications section of the Azure Active Directory portal blade.
$principalId4AppServiceLinuxFunctions='<principalId4AppServiceLinux>'
az login --tenant $tenantId

az account set --subscription $subscriptionId --verbose
az cosmosdb sql role assignment create --account-name $cosmosDBAccountName --resource-group $resourceGroupName --scope "/" --principal-id $principalId4AppServiceLinuxFunctions --role-definition-id $readOnlyRoleDefinitionId

$settingsKV = @{
    "AZURE_OPENAI_API_KEY"="<AZURE_OPENAI_API_KEY>"
    "AZURE_OPENAI_API_INSTANCE_NAME"="<AZURE_OPENAI_API_INSTANCE_NAME>"
    "AZURE_OPENAI_API_DEPLOYMENT_NAME"="<AZURE_OPENAI_API_DEPLOYMENT_NAME>"
    "AZURE_OPENAI_API_VERSION"="2023-06-01-preview"
    "GPT_SYSTEM_SETTING"="アシスタントは役に立ち、クリエイティブで、賢く、非常にフレンドリー、女性として回答してください。"
    "COSMOS_DATABASE_NAME"="<COSMOS_DATABASE_NAME>"
    "COSMOS_COLLECTIONS_NAME"="<COSMOS_COLLECTIONS_NAME>"
    "BING_API_KEY"="<BING_API_KEY>"
    "MS_SQL_HOST"="<MS_SQL_HOST>"
    "MS_SQL_PORT"="<MS_SQL_PORT>"
    "MS_SQL_USERNAME"="<MS_SQL_USERNAME>"
    "MS_SQL_PASSWORD"="<MS_SQL_PASSWORD>"
    "MS_SQL_DATABASE"="<MS_SQL_DATABASE>"
    "MS_SQL_INCLUDE_TABLE"="仕入先,運送会社,社員,受注,受注明細,商品,商品区分,都道府県,得意先"
    "MAX_TOKEN"=16384
    "cosmosDB__accountEndpoint "= "<cosmosDB__accountEndpoint>"    
}
$settingsKV|ConvertTo-Json -Compress|Out-File -FilePath .\setting.json
az webapp config appsettings set --resource-group $resourceGroupName --name $functionName --settings "@setting.json"
Remove-Item .\setting.json

func azure functionapp publish $functionName --build local --nozip
$startTime = (Get-Date).datetime
Write-Output "開始時間:${startTime}"
do {
    $ret = az functionapp function list -g $resourceGroupName -n $functionName
    if ($ret.length -gt 0 )
    {
        foreach ($item in $ret) {
            Write-Output "${item}"
        }
        
    }
}
while ($ret.length -le 0 )
$endTime = (Get-Date).datetime
Write-Output "終了時間:${endTime}"