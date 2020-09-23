using System;
using System.Security.Claims;
using System.Configuration;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.HttpsPolicy;
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

using back.Cards;
using back.DataLoader;
using back.Types;


namespace back
{
    public partial class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }
        internal static byte[] SharedSecret = Encoding.ASCII.GetBytes(
            "DEV-SECRET-KEY");
        
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

            services.AddScoped<IUserService, UserService>();
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureAuthenticationServices(services);
            // services.AddCors();


            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<AppDbContext>(b => b.UseSqlite("Data Source=test.db"));

            services.AddHttpContextAccessor();
            services.AddAuthorization(config => 
            {
                var defaultPolicy = new AuthorizationPolicyBuilder().RequireAssertion(context =>
                {
                    var directiveContext = context.Resource as IDirectiveContext;
                    Console.WriteLine("DEFAULT POLICY EVAL: " + directiveContext?.Path ?? "NULL");
                    return true;
                }).Build();

                config.DefaultPolicy = defaultPolicy;
            });

            services.AddControllers();

            services.AddDataLoader<UserByIdDataLoader>();
            services.AddDataLoader<CardByIdDataLoader>();
            services.AddGraphQL(BuildSchema);
            services.AddQueryRequestInterceptor((context, builder, ct) =>
            {
                if (context.User.Identity.IsAuthenticated)
                {
                    var userId = context.User.FindFirst(WellKnownClaimTypes.UserId).Value;
                    builder.AddProperty("currentUserId", userId);
                    builder.AddProperty("currentUserEmail", context.User.FindFirst(ClaimTypes.Email).Value);
                }
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

            app
                .UseRouting()
                .UseAuthentication()
                .UseAuthorization()
                .UseWebSockets()
                .UseGraphQL("/graphql")
                .UsePlayground("/graphql", "/graphql/playground")
                .UseVoyager()
                .UseEndpoints(endpoints => 
                {
                    endpoints.MapControllers();
                });
        }

        private ISchema BuildSchema(IServiceProvider serviceProvider)
        {
            return SchemaBuilder.New()
                .AddServices(serviceProvider)
                .AddAuthorizeDirectiveType()
                .AddQueryType(d => d.Name("Query"))
                .AddMutationType(d => d.Name("Mutation"))
                .AddType<CardType>()
                .AddType<UserType>()
                .AddType<UserMutations>()
                .AddType<CardMutations>()
                .AddAuthorizeDirectiveType()
                .EnableRelaySupport()
                .Create();
        }
    }
}
