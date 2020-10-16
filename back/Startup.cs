using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

using HotChocolate;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Voyager;
using HotChocolate.Resolvers;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;

using back.Middleware;
using back.Cards;
using back.Users;
using back.UsersSettings;
using back.Tags;
using back.Authorization;
using back.Kata;
using back.Data;
using back.Types;
using HotChocolate.Types;
using HotChocolate.Execution;
using back.Import;

namespace back
{
    public partial class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }
        internal static byte[] SharedSecret = Encoding.ASCII.GetBytes(
            "A-VERY-LONG-DEV-SECRET-KEY-TO-AVOID-ERRORS");

        public void ConfigureAuthenticationServices(IServiceCollection services)
        {
            services
                .AddAuthentication("jwt")
                .AddJwtBearer("jwt", x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(SharedSecret),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };
                });
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureAuthenticationServices(services);

            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContextPool<AppDbContext>(b =>
            {
                b.UseSqlite("Data Source=dev.db");
                if (Environment.IsDevelopment())
                {
                    b.EnableSensitiveDataLogging();
                    b.EnableDetailedErrors();
                }
            });
            services.AddLogging();

            // setup kata server
            services.Configure<KataServiceSettings>(Configuration.GetSection("KataServiceSettings"));
            services.Configure<ImportServiceSettings>(Configuration.GetSection("ImportServiceSettings"));
            services.AddSingleton<KataService>();
            services.AddScoped<AnkiTextImportService>();

            services.AddHttpContextAccessor();
            services.AddAuthorization(config =>
            {
                config.AddPolicy("EditsOwnCards", policy =>
                    policy.Requirements.Add(new EditsOwnCardsRequirement()));
                config.AddPolicy("AuthenticatedUser", policy =>
                    policy.Requirements.Add(new AuthenticatedUserRequirement()));

                var defaultPolicy = new AuthorizationPolicyBuilder().RequireAssertion(context =>
                {
                    var directiveContext = context.Resource as IDirectiveContext;
                    Console.WriteLine("DEFAULT POLICY EVAL: " + directiveContext?.Path ?? "NULL");
                    return true;
                }).Build();

                config.DefaultPolicy = defaultPolicy;
            });

            services.AddScoped<IAuthorizationHandler, EditsOwnCardsAuthorizationHandler>();
            services.AddScoped<IAuthorizationHandler, AuthenticatedUserAuthorizationHandler>();

            services.AddControllers();

            services.AddDataLoaderRegistry();
            services.AddGraphQL(BuildSchema);
            services.AddDiagnosticObserver<DiagnosticObserver>();
            services.AddQueryRequestInterceptor((context, builder, ct) =>
            {
                Console.WriteLine("========== QUERY INTERCEPTOR ============");
                if (context.User.Identity.IsAuthenticated)
                {
                    var userId = context.User.FindFirst(WellKnownClaimTypes.UserId).Value;
                    var userEmail = context.User.FindFirst(ClaimTypes.Email).Value;
                    builder.AddProperty("currentUserId", int.Parse(userId));
                    builder.AddProperty("currentUserEmail", userEmail);
                    Console.WriteLine(int.Parse(userId));
                    Console.WriteLine(context.User);
                    Console.WriteLine("The user is logged in: {0},{1}", userId, userEmail);
                }
                else
                {
                    Console.WriteLine("The user is not logged in");
                }
                Console.WriteLine("======== END QUERY INTERCEPTOR ==========");
                return Task.CompletedTask;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(o => o
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin());

            app
                .UseRouting()
                .UseAuthentication()
                .UseAuthorization()
                .UseWebSockets()
                .UseGraphQL("/graphql")
                .UseVoyager()
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });
        }

        private ISchema BuildSchema(IServiceProvider serviceProvider)
        {
            return SchemaBuilder.New()
                .BindClrType<DateTime, DateTimeType>()
                .BindClrType<TimeSpan, DateTimeType>()

                .AddServices(serviceProvider)
                .AddAuthorizeDirectiveType()
                .AddQueryType(d => d.Name("Query"))
                .AddType<UserQueries>()
                .AddType<CardQueries>()
                .AddType<TagQueries>()
                .AddMutationType(d => d.Name("Mutation"))
                .AddType<CardKindType>()
                .AddType<EvaluationEngineType>()
                .AddType<AttemptResultType>()
                .AddType<ReviewHistory>()
                .AddType<ReviewStatistic>()
                .AddType<UserMutations>()
                .AddType<CardMutations>()
                .AddType<UserSettingsMutations>()
                .AddType<UserSettings>()

                // Extensions
                .AddType<UserExtension>()
                .AddType<CardExtension>()

                .AddAuthorizeDirectiveType()
                .Create();
        }
    }
}
