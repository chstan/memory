using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Execution.Instrumentation;
using HotChocolate.Resolvers;
using Microsoft.Extensions.DiagnosticAdapter;
using Microsoft.Extensions.Logging;

namespace back.Middleware
{
    public class DiagnosticObserver : IDiagnosticObserver
    {
        private readonly ILogger _logger;

        public DiagnosticObserver(ILogger<DiagnosticObserver> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [DiagnosticName("HotChocolate.Execution.Query")]
        public void OnQuery(IQueryContext context)
        {}

        [DiagnosticName("HotChocolate.Execution.Query.Start")]
        public void BeginExecuteQuery(IQueryContext context)
        {
            _logger.LogInformation(context.Request.Query.ToString());
        }

        [DiagnosticName("HotChocolate.Execution.Query.Stop")]
        public void EndExecuteQuery(IQueryContext context)
        {
            if (context.Result is IReadOnlyQueryResult result)
            {
                using (var stream = new MemoryStream())
                {
                    var resultSerializer = new JsonQueryResultSerializer();
                    resultSerializer.SerializeAsync(
                        result, stream
                    ).GetAwaiter().GetResult();
                    _logger.LogInformation(Encoding.UTF8.GetString(stream.ToArray()));
                }
            }
        }

        [DiagnosticName("HotChocolate.Execution.Resolver.Error")]
        public void OnResolverError(IResolverContext context, IEnumerable<IError> errors)
        {
            foreach (IError error in errors)
            {
                string path = string.Join("/", error.Path.Select(t => t.ToString()));
                if (error.Exception == null)
                {
                    _logger.LogError("{0}\r\n{1}", path, error.Message);
                }
                else
                {
                    _logger.LogError(error.Exception, "{0}\r\n{1}", path, error.Message);
                }
            }
        }
    }
}