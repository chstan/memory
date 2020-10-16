using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;

using back.Data;

namespace back.Kata
{
   public class KataServiceSettings
   {
      public string Url { get; set; } = "";
      public int Timeout { get; set; }
   }

   public class KataRequest
   {
      public string Source { get; set; } = "";
      public string ExecutionEnvironment { get; set; } = nameof(EvaluationEngine.Python);
      public string ExecutionContext { get; set; } = "";
   }
   public class KataExecutionException : Exception
   {}

   public class KataService
   {
      private KataServiceSettings _settings;
      public KataService(IOptions<KataServiceSettings> settings)
      {
         _settings = settings.Value;
      }

      public async Task<KataResult> RunKata(KataRequest request)
      {
         var client = new RestClient(_settings.Url);
         var httpRequest = new RestRequest(Method.POST);
         httpRequest.AddJsonBody(new {
            source = request.Source,
            execution_environment = request.ExecutionEnvironment,
            execution_context = request.ExecutionContext,
         });
         IRestResponse response = await client.ExecuteAsync(httpRequest);

         if (response.IsSuccessful)
         {
            var content = JsonConvert.DeserializeObject<JToken>(response.Content);
            return new KataResult
            {
               ResponseCode = content["response_code"].Value<int>(),
               ResponseText = content["response_text"].Value<string>(),
               TotalExecutionTime = content["total_execution_time"].Value<float>(),
            };
         }

         throw new KataExecutionException();
      }

        public class KataResult
        {
           public int ResponseCode { get; set; }
           public string ResponseText { get; set;  } = "";
           public float TotalExecutionTime { get; set; }
        }
    }
}