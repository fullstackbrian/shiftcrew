import matplotlib.pyplot as plt
from matplotlib import font_manager

def create_logo(bg_color, text_color, filename):
    fig, ax = plt.subplots(figsize=(8, 4), dpi=300)
    fig.patch.set_facecolor(bg_color)
    ax.set_facecolor(bg_color)
    
    # Main Text - ShiftCrew
    ax.text(0.5, 0.6, "ShiftCrew", 
            fontsize=60, 
            fontname='serif',  # Will use default serif (closer to Playfair Display feel)
            fontweight='bold', 
            color=text_color, 
            ha='center', va='center')
    
    # Tagline - Built by crew, for crew
    # Note: matplotlib doesn't support letter_spacing directly
    # You can manually space letters or use a workaround
    tagline = "BUILT BY CREW, FOR CREW"
    # Manual spacing workaround - add spaces between letters
    spaced_tagline = " ".join(tagline)
    
    ax.text(0.5, 0.4, spaced_tagline, 
            fontsize=12, 
            fontname='sans-serif', 
            fontweight='normal', 
            color=text_color, 
            ha='center', va='center')
            
    ax.axis('off')
    plt.tight_layout()
    plt.savefig(filename, facecolor=bg_color, bbox_inches='tight', dpi=300)
    plt.close()

# Your brand green (matches site)
brand_green = "#22c55e"

# Generate Primary logo
create_logo('white', brand_green, 'ShiftCrew_Primary.png')

# Optional: Generate dark version
create_logo('#111827', brand_green, 'ShiftCrew_Dark.png')

print("Logos generated successfully!")
